// LocalStorage utilities for KLEVIA

const STORAGE_KEYS = {
    USER: 'klevia_user',
    PROGRESS: 'klevia_progress',
    SETTINGS: 'klevia_settings',
    STREAK: 'klevia_streak',
};

// Default values
const defaultUser = {
    name: 'Pelajar',
    kelas: null,
    subject: null,
    xp: 0,
    level: 1,
    hearts: 5,
    lessonsCompleted: 0,
    isPremium: false,
    premiumExpiry: null,
};

const defaultProgress = {
    lessons: {},
    currentLesson: null,
};

const defaultSettings = {
    soundEnabled: true,
};

const defaultStreak = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    streakFreezeUsed: false, // Premium: can use 1 freeze per day
    streakFreezeDate: null,
};

// User functions
export const getUser = () => {
    try {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? { ...defaultUser, ...JSON.parse(user) } : defaultUser;
    } catch {
        return defaultUser;
    }
};

export const setUser = (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const updateUser = (updates) => {
    const current = getUser();
    const updated = { ...current, ...updates };
    setUser(updated);
    return updated;
};

// Progress functions
export const getProgress = () => {
    try {
        const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
        return progress ? { ...defaultProgress, ...JSON.parse(progress) } : defaultProgress;
    } catch {
        return defaultProgress;
    }
};

export const setProgress = (progress) => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const updateLessonProgress = (lessonId, data) => {
    const progress = getProgress();
    progress.lessons[lessonId] = {
        ...progress.lessons[lessonId],
        ...data,
    };
    setProgress(progress);
    return progress;
};

export const getLessonProgress = (lessonId) => {
    const progress = getProgress();
    return progress.lessons[lessonId] || { completed: false, score: 0, questionsAnswered: 0 };
};

// Streak functions
export const getStreak = () => {
    try {
        const streak = localStorage.getItem(STORAGE_KEYS.STREAK);
        return streak ? { ...defaultStreak, ...JSON.parse(streak) } : defaultStreak;
    } catch {
        return defaultStreak;
    }
};

export const setStreak = (streak) => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
};

// Check and update streak - call when user completes a lesson
export const updateStreak = (isPremium = false) => {
    const streak = getStreak();
    const today = new Date().toDateString();
    const lastActive = streak.lastActiveDate;

    // Already active today, no change needed
    if (lastActive === today) {
        return streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = { ...streak };

    if (lastActive === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak.currentStreak = streak.currentStreak + 1;
        newStreak.longestStreak = Math.max(newStreak.currentStreak, streak.longestStreak);
    } else if (lastActive && lastActive !== today) {
        // Missed day(s)
        if (isPremium && !streak.streakFreezeUsed) {
            // Premium user can use streak freeze
            newStreak.streakFreezeUsed = true;
            newStreak.streakFreezeDate = today;
            // Keep the streak
        } else {
            // Reset streak
            newStreak.currentStreak = 1;
        }
    } else {
        // First time or no previous record
        newStreak.currentStreak = 1;
    }

    // Reset freeze availability on new day
    if (streak.streakFreezeDate !== today) {
        newStreak.streakFreezeUsed = false;
    }

    newStreak.lastActiveDate = today;
    newStreak.longestStreak = Math.max(newStreak.currentStreak, newStreak.longestStreak || 0);

    setStreak(newStreak);
    return newStreak;
};

// Settings functions
export const getSettings = () => {
    try {
        const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

export const setSettings = (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const updateSettings = (updates) => {
    const current = getSettings();
    const updated = { ...current, ...updates };
    setSettings(updated);
    return updated;
};

// Reset all data
export const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STREAK);
};

// Check if user has completed onboarding
export const hasCompletedOnboarding = () => {
    const user = getUser();
    return user.kelas !== null && user.subject !== null;
};

// Premium helpers
export const isPremiumActive = () => {
    const user = getUser();
    if (!user.isPremium) return false;
    if (!user.premiumExpiry) return false;
    return new Date(user.premiumExpiry) > new Date();
};

export const activatePremium = (plan) => {
    const expiry = new Date();
    if (plan === 'monthly') {
        expiry.setMonth(expiry.getMonth() + 1);
    } else if (plan === 'yearly') {
        expiry.setFullYear(expiry.getFullYear() + 1);
    }
    return updateUser({ isPremium: true, premiumExpiry: expiry.toISOString() });
};

export default {
    getUser,
    setUser,
    updateUser,
    getProgress,
    setProgress,
    updateLessonProgress,
    getLessonProgress,
    getStreak,
    setStreak,
    updateStreak,
    getSettings,
    setSettings,
    updateSettings,
    resetAllData,
    hasCompletedOnboarding,
    isPremiumActive,
    activatePremium,
};
