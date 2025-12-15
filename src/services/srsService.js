// SRS (Spaced Repetition System) Service
// Implements SM-2 algorithm for optimal learning intervals

import { db } from '../firebase/config';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    Timestamp
} from 'firebase/firestore';

/**
 * SM-2 Algorithm Parameters
 * - Ease Factor (EF): How easy the card is (min 1.3, default 2.5)
 * - Interval: Days until next review
 * - Repetitions: Successful review streak
 */

// Quality ratings
export const QUALITY = {
    AGAIN: 0,      // Complete blackout, wrong answer
    HARD: 1,       // Wrong but remembered after seeing answer
    GOOD: 2,       // Correct with difficulty
    EASY: 3,       // Correct with ease
};

/**
 * Calculate next review using SM-2 algorithm
 * @param {number} quality - 0-3 rating of answer quality
 * @param {number} repetitions - Current successful repetitions
 * @param {number} easeFactor - Current ease factor
 * @param {number} interval - Current interval in days
 * @returns {Object} - { interval, repetitions, easeFactor }
 */
export function calculateNextReview(quality, repetitions, easeFactor, interval) {
    let newEF = easeFactor;
    let newInterval = interval;
    let newReps = repetitions;

    if (quality < 2) {
        // Wrong answer - reset to beginning
        newReps = 0;
        newInterval = 0; // Review immediately (within minutes)
    } else {
        // Correct answer
        if (newReps === 0) {
            newInterval = 1; // 1 day
        } else if (newReps === 1) {
            newInterval = 6; // 6 days
        } else {
            newInterval = Math.round(interval * easeFactor);
        }
        newReps += 1;
    }

    // Update ease factor based on quality
    // EF' = EF + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
    newEF = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));

    // Minimum EF is 1.3
    if (newEF < 1.3) newEF = 1.3;

    return {
        interval: newInterval,
        repetitions: newReps,
        easeFactor: Number(newEF.toFixed(2)),
    };
}

/**
 * Convert interval (days) to milliseconds
 */
function intervalToMs(intervalDays) {
    if (intervalDays === 0) {
        // "Again" - review in 10 minutes
        return 10 * 60 * 1000;
    }
    return intervalDays * 24 * 60 * 60 * 1000;
}

/**
 * Add a card to SRS (when user gets wrong answer)
 */
export async function addToSRS(userId, questionData) {
    const { questionId, lessonId, question, correctAnswer, options, type } = questionData;

    const cardRef = doc(db, 'users', userId, 'srs_cards', questionId);

    // Check if card already exists
    const existing = await getDoc(cardRef);

    if (existing.exists()) {
        // Card exists - just update nextReview to now (needs review again)
        await setDoc(cardRef, {
            ...existing.data(),
            repetitions: 0,
            interval: 0,
            nextReview: Timestamp.now(),
            lastReview: Timestamp.now(),
        }, { merge: true });
    } else {
        // New card
        await setDoc(cardRef, {
            questionId,
            lessonId,
            question,
            correctAnswer,
            options: options || null,
            type: type || 'multiple_choice',
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReview: Timestamp.now(), // Due now
            lastReview: null,
            createdAt: Timestamp.now(),
        });
    }

    console.log(`📚 Added to SRS: ${questionId}`);
    return true;
}

/**
 * Update card after review
 */
export async function reviewCard(userId, cardId, quality) {
    const cardRef = doc(db, 'users', userId, 'srs_cards', cardId);
    const cardSnap = await getDoc(cardRef);

    if (!cardSnap.exists()) {
        throw new Error('Card not found');
    }

    const card = cardSnap.data();
    const { interval, repetitions, easeFactor } = calculateNextReview(
        quality,
        card.repetitions,
        card.easeFactor,
        card.interval
    );

    const nextReviewDate = new Date(Date.now() + intervalToMs(interval));

    await setDoc(cardRef, {
        ...card,
        interval,
        repetitions,
        easeFactor,
        lastReview: Timestamp.now(),
        nextReview: Timestamp.fromDate(nextReviewDate),
    });

    console.log(`✅ Reviewed card: ${cardId}, next in ${interval} days`);
    return { interval, repetitions, easeFactor };
}

/**
 * Get cards due for review
 */
export async function getDueCards(userId, limit = 20) {
    const cardsRef = collection(db, 'users', userId, 'srs_cards');
    const now = Timestamp.now();

    const q = query(
        cardsRef,
        where('nextReview', '<=', now),
        orderBy('nextReview', 'asc')
    );

    const snapshot = await getDocs(q);
    const cards = [];

    snapshot.forEach((doc) => {
        if (cards.length < limit) {
            cards.push({ id: doc.id, ...doc.data() });
        }
    });

    return cards;
}

/**
 * Get count of due cards
 */
export async function getDueCardCount(userId) {
    const cards = await getDueCards(userId, 100);
    return cards.length;
}

/**
 * Get all SRS cards for user
 */
export async function getAllCards(userId) {
    const cardsRef = collection(db, 'users', userId, 'srs_cards');
    const snapshot = await getDocs(cardsRef);

    const cards = [];
    snapshot.forEach((doc) => {
        cards.push({ id: doc.id, ...doc.data() });
    });

    return cards;
}

/**
 * Remove card from SRS (mastered)
 */
export async function removeFromSRS(userId, cardId) {
    const cardRef = doc(db, 'users', userId, 'srs_cards', cardId);
    await deleteDoc(cardRef);
    console.log(`🎓 Mastered & removed: ${cardId}`);
}

/**
 * Get SRS statistics
 */
export async function getSRSStats(userId) {
    const cards = await getAllCards(userId);
    const now = Date.now();

    let dueNow = 0;
    let learning = 0;
    let reviewing = 0;
    let mastered = 0;

    cards.forEach(card => {
        const nextReview = card.nextReview?.toDate?.() || new Date(card.nextReview);

        if (nextReview <= new Date(now)) {
            dueNow++;
        }

        if (card.repetitions === 0) {
            learning++;
        } else if (card.repetitions < 5) {
            reviewing++;
        } else {
            mastered++;
        }
    });

    return {
        total: cards.length,
        dueNow,
        learning,
        reviewing,
        mastered,
    };
}

export default {
    QUALITY,
    calculateNextReview,
    addToSRS,
    reviewCard,
    getDueCards,
    getDueCardCount,
    getAllCards,
    removeFromSRS,
    getSRSStats,
};
