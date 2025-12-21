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
    arrayUnion,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { questions } from '../data/allQuestions';

// Constants for cleanup
const STALE_PLAYING_TIMEOUT = 60 * 60 * 1000; // 1 hour - room playing too long
const STALE_WAITING_TIMEOUT = 30 * 60 * 1000; // 30 minutes - room waiting too long
const FINISHED_CLEANUP_TIMEOUT = 5 * 60 * 1000; // 5 minutes - cleanup finished rooms

/**
 * Cleanup stale rooms (called when accessing battle lobby)
 */
export async function cleanupStaleRooms() {
    const now = Date.now();
    const battlesRef = collection(db, 'quiz_battles');

    try {
        const snapshot = await getDocs(battlesRef);
        const deletePromises = [];

        snapshot.forEach((docSnap) => {
            const room = docSnap.data();
            const createdAt = room.createdAt?.toMillis?.() || 0;
            const startedAt = room.startedAt?.toMillis?.() || 0;

            let shouldDelete = false;

            // Delete finished rooms older than 5 minutes
            if (room.status === 'finished') {
                const finishedTime = startedAt || createdAt;
                if (now - finishedTime > FINISHED_CLEANUP_TIMEOUT) {
                    shouldDelete = true;
                    console.log(`🧹 Cleaning finished room: ${docSnap.id}`);
                }
            }
            // Delete playing rooms older than 1 hour (stuck/abandoned)
            else if (room.status === 'playing' || room.status === 'countdown') {
                if (startedAt && now - startedAt > STALE_PLAYING_TIMEOUT) {
                    shouldDelete = true;
                    console.log(`🧹 Cleaning stale playing room: ${docSnap.id}`);
                }
            }
            // Delete waiting rooms older than 30 minutes
            else if (room.status === 'waiting' || room.status === 'ready') {
                if (now - createdAt > STALE_WAITING_TIMEOUT) {
                    shouldDelete = true;
                    console.log(`🧹 Cleaning stale waiting room: ${docSnap.id}`);
                }
            }

            if (shouldDelete) {
                deletePromises.push(deleteDoc(doc(db, 'quiz_battles', docSnap.id)));
            }
        });

        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
            console.log(`🧹 Cleaned up ${deletePromises.length} stale rooms`);
        }
    } catch (error) {
        console.error('Error cleaning up stale rooms:', error);
    }
}

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
    // SMA Lesson ID format: KKSNN where KK=kelas (10,11,12), S=subject (1-9 single, 10-12 special), NN=lesson
    // Actually format is: KKXNN where KK=kelas, X=subject code (1-9), NN=lesson number
    // For subject codes >= 10, we need different handling
    let startId, endId;
    switch (kelas) {
        case 7: startId = 101; endId = 199; break;
        case 8: startId = 201; endId = 299; break;
        case 9: startId = 301; endId = 399; break;
        case 10: startId = 10101; endId = 10999; break;
        case 11: startId = 11101; endId = 11999; break;
        case 12: startId = 12101; endId = 12999; break;
        default: startId = 101; endId = 199;
    }

    // Explicit lesson ID ranges per subject per class
    // This avoids confusion from the inconsistent ID format
    // Based on actual lessonsSMA.js data
    const subjectRanges = {
        // Kelas 7 - SMP (from lessons.js)
        7: {
            'matematika': { ids: [101, 102, 103, 104, 1005, 1006, 1007, 1008, 1009, 1010] },
            'ipa': { ids: [105, 106, 107, 108, 1011, 1012, 1013, 1014, 1015, 1016] },
            'bahasa': { ids: [109, 110, 111, 112, 1017, 1018, 1019, 1020, 1021, 1022] },
            'english': { ids: [113, 114, 115, 116, 1023, 1024, 1025, 1026, 1027, 1028] },
        },
        // Kelas 8 - SMP (from lessons.js)
        8: {
            'matematika': { ids: [201, 202, 203, 204, 2005, 2006, 2007, 2008, 2009, 2010] },
            'ipa': { ids: [205, 206, 207, 208, 2011, 2012, 2013, 2014, 2015, 2016] },
            'bahasa': { ids: [209, 210, 211, 212, 2017, 2018, 2019, 2020, 2021, 2022] },
            'english': { ids: [213, 214, 215, 216, 2023, 2024, 2025, 2026, 2027, 2028] },
        },
        // Kelas 9 - SMP (from lessons.js)
        9: {
            'matematika': { ids: [301, 302, 303, 304, 3005, 3006, 3007, 3008, 3009, 3010] },
            'ipa': { ids: [305, 306, 307, 308, 3011, 3012, 3013, 3014, 3015, 3016] },
            'bahasa': { ids: [309, 310, 311, 312, 3017, 3018, 3019, 3020, 3021, 3022] },
            'english': { ids: [313, 314, 315, 316, 3023, 3024, 3025, 3026, 3027, 3028] },
        },
        // Kelas 10 - SMA (from lessonsSMA.js lines 10-109)
        10: {
            'matematika': { start: 10101, end: 10112 },
            'bahasa': { start: 10201, end: 10206 },
            'english': { start: 10301, end: 10312 },
            'biologi': { start: 10401, end: 10404 },
            'kimia': { start: 10501, end: 10505 },
            'fisika': { start: 10601, end: 10604 },
            'ekonomi': { start: 10701, end: 10704 },
            'sosiologi': { start: 10801, end: 10808 },
            'geografi': { start: 10901, end: 10903 },
            'sejarah': { start: 11001, end: 11005 },
            'pkn': { start: 11101, end: 11105 },
            'informatika': { start: 11201, end: 11207 },
        },
        // Kelas 11 - SMA (from lessonsSMA.js lines 117-200)
        // NOTE: Subjects after ekonomi use 6-digit IDs (111xxx) to avoid conflict with Kelas 12
        11: {
            'matematika': { start: 11301, end: 11307 },
            'bahasa': { start: 11401, end: 11405 },
            'english': { start: 11501, end: 11505 },
            'biologi': { start: 11601, end: 11605 },
            'kimia': { start: 11701, end: 11705 },
            'fisika': { start: 11801, end: 11805 },
            'ekonomi': { start: 11901, end: 11905 },
            'sosiologi': { start: 111001, end: 111005 },
            'geografi': { start: 111101, end: 111105 },
            'sejarah': { start: 111201, end: 111205 },
            'pkn': { start: 111301, end: 111305 },
            'informatika': { start: 111401, end: 111405 },
        },
        // Kelas 12 - SMA (from lessonsSMA.js lines 207-255)
        12: {
            'matematika': { start: 12301, end: 12303 },
            'bahasa': { start: 12401, end: 12403 },
            'english': { start: 12501, end: 12502 },
            'biologi': { start: 12601, end: 12603 },
            'kimia': { start: 12701, end: 12702 },
            'fisika': { start: 12801, end: 12802 },
            'ekonomi': { start: 12901, end: 12902 },
            'sosiologi': { start: 13001, end: 13002 },
            'geografi': { start: 13101, end: 13102 },
            'sejarah': { start: 13201, end: 13202 },
            'pkn': { start: 13301, end: 13302 },
            'informatika': { start: 13401, end: 13402 },
        },
    };

    // Get all questions from these lesson IDs
    let allQuestions = [];
    console.log(`🎮 Looking for questions - Kelas ${kelas}, subject: ${subject}`);

    // If we have explicit subject ranges for this class, use them
    if (subject !== 'all' && subjectRanges[kelas] && subjectRanges[kelas][subject]) {
        const range = subjectRanges[kelas][subject];

        // Check if using explicit IDs array (for SMP) or start/end range (for SMA)
        if (range.ids) {
            console.log(`🎮 Using explicit IDs for ${subject}: ${range.ids.join(', ')}`);
            for (const lessonId of range.ids) {
                const lessonQuestions = questions[lessonId] || questions[String(lessonId)];
                if (lessonQuestions && Array.isArray(lessonQuestions)) {
                    allQuestions = [...allQuestions, ...lessonQuestions.map(q => ({
                        ...q,
                        lessonId
                    }))];
                }
            }
        } else {
            console.log(`🎮 Using range for ${subject}: ${range.start}-${range.end}`);
            for (let lessonId = range.start; lessonId <= range.end; lessonId++) {
                const lessonQuestions = questions[lessonId] || questions[String(lessonId)];
                if (lessonQuestions && Array.isArray(lessonQuestions)) {
                    allQuestions = [...allQuestions, ...lessonQuestions.map(q => ({
                        ...q,
                        lessonId
                    }))];
                }
            }
        }
    } else if (subject === 'all' && subjectRanges[kelas]) {
        // For 'all' subjects, get questions from all subjects for this class
        console.log(`🎮 Getting all subjects for Kelas ${kelas}`);
        for (const subjectKey of Object.keys(subjectRanges[kelas])) {
            const range = subjectRanges[kelas][subjectKey];

            if (range.ids) {
                for (const lessonId of range.ids) {
                    const lessonQuestions = questions[lessonId] || questions[String(lessonId)];
                    if (lessonQuestions && Array.isArray(lessonQuestions)) {
                        allQuestions = [...allQuestions, ...lessonQuestions.map(q => ({
                            ...q,
                            lessonId
                        }))];
                    }
                }
            } else if (range.start && range.end) {
                for (let lessonId = range.start; lessonId <= range.end; lessonId++) {
                    const lessonQuestions = questions[lessonId] || questions[String(lessonId)];
                    if (lessonQuestions && Array.isArray(lessonQuestions)) {
                        allQuestions = [...allQuestions, ...lessonQuestions.map(q => ({
                            ...q,
                            lessonId
                        }))];
                    }
                }
            }
        }
    } else {
        // Fallback to original range-based approach (shouldn't reach here normally)
        console.log(`🎮 Fallback: Using range ${startId}-${endId}`);
        for (let lessonId = startId; lessonId <= endId; lessonId++) {
            const lessonQuestions = questions[lessonId] || questions[String(lessonId)];
            if (lessonQuestions && Array.isArray(lessonQuestions)) {
                allQuestions = [...allQuestions, ...lessonQuestions.map(q => ({
                    ...q,
                    lessonId
                }))];
            }
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
    const now = Date.now();
    const createdAt = roomData.createdAt?.toMillis?.() || 0;
    const startedAt = roomData.startedAt?.toMillis?.() || 0;

    // Check if room is stale and auto-delete
    const isStaleWaiting = roomData.status === 'waiting' && now - createdAt > STALE_WAITING_TIMEOUT;
    const isStalePlaying = (roomData.status === 'playing' || roomData.status === 'countdown') &&
        startedAt && now - startedAt > STALE_PLAYING_TIMEOUT;

    if (isStaleWaiting || isStalePlaying) {
        await deleteDoc(roomRef);
        throw new Error('Room sudah kadaluarsa');
    }

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
    cleanupStaleRooms,
};
