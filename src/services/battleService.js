// Multiplayer Quiz Battle Service
// Real-time battle with Firestore

import { db } from '../firebase/config';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    Timestamp,
    arrayUnion
} from 'firebase/firestore';
import { questions } from '../data/allQuestions';

/**
 * Generate random 6-character room code
 */
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Get questions for a class (all subjects or specific)
 * Lesson ID format for SMA: KKSNN
 * - KK = kelas (10, 11, 12)
 * - S = subject (1=mat, 2=indo, 3=eng, 4=bio, 5=kim, 6=fis, 7=eko, 8=sos, 9=geo, 10=sej, 11=pkn, 12=info)
 * - NN = lesson number
 */
function getQuestionsForClass(kelas, count = 10, subject = 'all') {
    // Get lesson ID range based on class
    let startId, endId;
    switch (kelas) {
        case 7: startId = 101; endId = 199; break;
        case 8: startId = 201; endId = 299; break;
        case 9: startId = 301; endId = 399; break;
        case 10: startId = 10101; endId = 11299; break;
        case 11: startId = 11101; endId = 11299; break;
        case 12: startId = 12101; endId = 12299; break;
        default: startId = 101; endId = 199;
    }

    // Subject code mapping for SMA (middle digit in 5-digit ID)
    const subjectCodeMap = {
        'matematika': [1],
        'bahasa': [2],
        'english': [3],
        'biologi': [4],
        'kimia': [5],
        'fisika': [6],
        'ekonomi': [7],
        'sosiologi': [8],
        'geografi': [9],
        'sejarah': [10],
        'pkn': [11],
        'informatika': [12],
        'ipa': [1, 2, 3, 4], // SMP IPA includes multiple topics
    };

    // Get all questions from these lesson IDs
    let allQuestions = [];
    console.log(`🎮 Looking for questions in range ${startId}-${endId}, subject: ${subject}`);

    for (let lessonId = startId; lessonId <= endId; lessonId++) {
        // Filter by subject if not 'all'
        if (subject !== 'all' && kelas >= 10) {
            // For SMA, extract subject digit (position 3 in 5-digit ID like 10101)
            const lessonStr = String(lessonId);
            if (lessonStr.length === 5) {
                const subjectDigit = parseInt(lessonStr[2]);
                const allowedSubjects = subjectCodeMap[subject] || [];
                if (!allowedSubjects.includes(subjectDigit)) continue;
            }
        } else if (subject !== 'all' && kelas <= 9) {
            // For SMP, simpler logic based on first digit after class
            // 1xx = mat/ipa, 2xx would be bahasa, etc. (simplified for now)
            // Currently SMP has mixed subjects, so we skip strict filtering
        }

        const lessonQuestions = questions[lessonId] || questions[String(lessonId)];
        if (lessonQuestions && Array.isArray(lessonQuestions)) {
            allQuestions = [...allQuestions, ...lessonQuestions.map(q => ({
                ...q,
                lessonId
            }))];
        }
    }

    console.log(`🎮 Found ${allQuestions.length} questions for Kelas ${kelas}, subject: ${subject}`);

    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);

    // Pick unique questions and shuffle their options
    const seenQuestions = new Set();
    const selectedQuestions = [];

    for (const q of shuffled) {
        // Skip duplicate question texts
        if (seenQuestions.has(q.question)) continue;
        seenQuestions.add(q.question);

        // Shuffle options and update correct answer index
        const originalOptions = [...q.options];
        const correctOptionText = originalOptions[q.correctAnswer];

        // Create shuffled indices
        const indices = [0, 1, 2, 3];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Shuffle options using indices
        const shuffledOptions = indices.map(i => originalOptions[i]);
        const newCorrectAnswer = shuffledOptions.indexOf(correctOptionText);

        selectedQuestions.push({
            id: selectedQuestions.length,
            question: q.question,
            options: shuffledOptions,
            correctAnswer: newCorrectAnswer,
            lessonId: q.lessonId
        });

        if (selectedQuestions.length >= count) break;
    }

    return selectedQuestions;
}

/**
 * Available classes for battle
 */
export function getAvailableClasses() {
    return [
        { id: 7, name: 'Kelas 7', level: 'SMP' },
        { id: 8, name: 'Kelas 8', level: 'SMP' },
        { id: 9, name: 'Kelas 9', level: 'SMP' },
        { id: 10, name: 'Kelas 10', level: 'SMA' },
        { id: 11, name: 'Kelas 11', level: 'SMA' },
        { id: 12, name: 'Kelas 12', level: 'SMA' },
    ];
}

/**
 * Create a new battle room
 */
export async function createRoom(hostData, settings) {
    const roomCode = generateRoomCode();
    const roomRef = doc(db, 'quiz_battles', roomCode);

    // Check if code already exists
    const existing = await getDoc(roomRef);
    if (existing.exists()) {
        // Retry with new code
        return createRoom(hostData, settings);
    }

    const battleQuestions = getQuestionsForClass(settings.kelas, settings.questionCount, settings.subject || 'all');

    const roomData = {
        code: roomCode,
        hostId: hostData.uid,
        hostName: hostData.name,
        hostPhoto: hostData.photoURL || null,
        guestId: null,
        guestName: null,
        guestPhoto: null,
        status: 'waiting', // waiting, ready, countdown, playing, finished
        hostReady: true,
        guestReady: false,
        settings: {
            kelas: settings.kelas,
            kelasName: settings.kelasName,
            subject: settings.subject || 'all',
            subjectName: settings.subjectName || 'Semua Mapel',
            questionCount: settings.questionCount || 10,
            timePerQuestion: settings.timePerQuestion || 15, // seconds, 0 = unlimited
            mode: settings.mode || 'timed', // 'timed' or 'race' (first to finish)
        },
        questions: battleQuestions,
        currentQuestion: 0,
        hostScore: 0,
        guestScore: 0,
        hostAnswers: [],
        guestAnswers: [],
        hostFinished: false,
        guestFinished: false,
        startedAt: null,
        createdAt: Timestamp.now(),
    };

    await setDoc(roomRef, roomData);
    console.log(`🎮 Room created: ${roomCode}`);

    return { roomCode, roomData };
}

/**
 * Join an existing room
 */
export async function joinRoom(roomCode, guestData) {
    const roomRef = doc(db, 'quiz_battles', roomCode.toUpperCase());
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error('Room tidak ditemukan');
    }

    const roomData = roomSnap.data();

    if (roomData.guestId) {
        throw new Error('Room sudah penuh');
    }

    if (roomData.status !== 'waiting') {
        throw new Error('Game sudah dimulai');
    }

    await updateDoc(roomRef, {
        guestId: guestData.uid,
        guestName: guestData.name,
        guestPhoto: guestData.photoURL || null,
        status: 'ready',
    });

    console.log(`🎮 Guest joined: ${roomCode}`);
    return { ...roomData, guestId: guestData.uid, guestName: guestData.name };
}

/**
 * Set player ready status
 */
export async function setReady(roomCode, playerId, isReady) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');

    const room = roomSnap.data();
    const isHost = room.hostId === playerId;

    await updateDoc(roomRef, {
        [isHost ? 'hostReady' : 'guestReady']: isReady
    });
}

/**
 * Start the game (host only)
 */
export async function startGame(roomCode, hostId) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');

    const room = roomSnap.data();

    if (room.hostId !== hostId) throw new Error('Only host can start');
    if (!room.guestReady) throw new Error('Guest not ready');

    await updateDoc(roomRef, {
        status: 'countdown',
        startedAt: Timestamp.now(),
    });

    // After 3 seconds countdown, set to playing
    setTimeout(async () => {
        await updateDoc(roomRef, {
            status: 'playing'
        });
    }, 3000);
}

/**
 * Submit answer
 */
export async function submitAnswer(roomCode, playerId, questionIndex, answerIndex, isCorrect) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');

    const room = roomSnap.data();
    const isHost = room.hostId === playerId;

    const answerData = {
        questionIndex,
        answerIndex,
        isCorrect,
        answeredAt: Timestamp.now()
    };

    const updates = {
        [isHost ? 'hostAnswers' : 'guestAnswers']: arrayUnion(answerData),
    };

    if (isCorrect) {
        updates[isHost ? 'hostScore' : 'guestScore'] = (isHost ? room.hostScore : room.guestScore) + 1;
    }

    await updateDoc(roomRef, updates);
}

/**
 * Player finished all questions
 */
export async function finishQuiz(roomCode, playerId) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) throw new Error('Room not found');

    const room = roomSnap.data();
    const isHost = room.hostId === playerId;

    await updateDoc(roomRef, {
        [isHost ? 'hostFinished' : 'guestFinished']: true
    });

    // Check if both finished
    const updatedSnap = await getDoc(roomRef);
    const updatedRoom = updatedSnap.data();

    if (updatedRoom.hostFinished && updatedRoom.guestFinished) {
        await updateDoc(roomRef, {
            status: 'finished'
        });
    }
}

/**
 * End game (time's up or both finished)
 */
export async function endGame(roomCode) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    await updateDoc(roomRef, {
        status: 'finished'
    });
}

/**
 * Subscribe to room updates
 */
export function subscribeToRoom(roomCode, callback) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() });
        } else {
            callback(null);
        }
    });
}

/**
 * Leave/delete room
 */
export async function leaveRoom(roomCode, playerId) {
    const roomRef = doc(db, 'quiz_battles', roomCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return;

    const room = roomSnap.data();

    if (room.hostId === playerId) {
        // Host leaves = delete room
        await deleteDoc(roomRef);
    } else {
        // Guest leaves
        await updateDoc(roomRef, {
            guestId: null,
            guestName: null,
            guestPhoto: null,
            guestReady: false,
            status: 'waiting'
        });
    }
}

export default {
    generateRoomCode,
    getAvailableClasses,
    createRoom,
    joinRoom,
    setReady,
    startGame,
    submitAnswer,
    finishQuiz,
    endGame,
    subscribeToRoom,
    leaveRoom,
};
