// AppContext - Now just a wrapper for AuthContext with some helpers
import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
    const auth = useAuth();
    const [currentHearts, setCurrentHearts] = useState(5);
    const [settings, setSettings] = useState({
        soundEnabled: true,
    });

    // Derived values from auth userData
    const user = {
        name: auth.userData?.displayName || 'Pelajar',
        kelas: auth.userData?.kelas,
        subject: auth.userData?.subject,
        xp: auth.userData?.xp || 0,
        level: auth.userData?.level || 1,
        lessonsCompleted: auth.userData?.lessonsCompleted || 0,
        isPremium: auth.userData?.isPremium || false,
        premiumExpiry: auth.userData?.premiumExpiry,
        gender: auth.userData?.gender,
        birthDate: auth.userData?.birthDate,
        profileCompleted: auth.userData?.profileCompleted || false,
        photoURL: auth.currentUser?.photoURL,
        email: auth.currentUser?.email,
    };

    const progress = auth.userData?.progress || { lessons: {} };
    const streak = auth.userData?.streak || { currentStreak: 0, longestStreak: 0 };

    // Check if premium is active
    const checkPremium = useCallback(() => {
        return user.isPremium && new Date(user.premiumExpiry) > new Date();
    }, [user.isPremium, user.premiumExpiry]);

    // Update user data
    const updateUser = useCallback(async (updates) => {
        await auth.updateUserData(updates);
    }, [auth]);

    // Update progress
    const updateProgress = useCallback(async (lessonId, data) => {
        await auth.updateProgress(lessonId, data);
    }, [auth]);

    // Update settings (local only for now)
    const updateSettings = useCallback((updates) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    // Add XP
    const addXP = useCallback(async (amount) => {
        return await auth.addXP(amount);
    }, [auth]);

    // Complete lesson
    const completeLesson = useCallback(async (lessonId, score, totalQuestions) => {
        return await auth.completeLesson(lessonId, score, totalQuestions);
    }, [auth]);

    // Decrease hearts
    const loseHeart = useCallback(() => {
        if (checkPremium()) {
            return currentHearts; // Premium don't lose hearts
        }
        const newHearts = Math.max(0, currentHearts - 1);
        setCurrentHearts(newHearts);
        return newHearts;
    }, [currentHearts, checkPremium]);

    // Reset hearts
    const resetHearts = useCallback(() => {
        setCurrentHearts(5);
    }, []);

    // Update streak
    const updateStreak = useCallback(async () => {
        const today = new Date().toDateString();
        const lastActive = streak.lastActiveDate;
        let newStreak = { ...streak };

        if (lastActive !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastActive === yesterday) {
                newStreak.currentStreak = (newStreak.currentStreak || 0) + 1;
            } else if (!checkPremium() || streak.streakFreezeUsed) {
                newStreak.currentStreak = 1;
            }
            newStreak.lastActiveDate = today;
            newStreak.longestStreak = Math.max(newStreak.longestStreak || 0, newStreak.currentStreak);
            newStreak.streakFreezeUsed = false;

            await auth.updateStreak(newStreak);
        }

        return newStreak;
    }, [streak, auth, checkPremium]);

    // Activate premium
    const activatePremium = useCallback(async (plan) => {
        await auth.activatePremium(plan);
    }, [auth]);

    // Reset all (logout essentially)
    const resetAll = useCallback(async () => {
        await auth.logout();
    }, [auth]);

    const value = {
        // User data
        user,
        progress,
        settings,
        streak,
        currentHearts,

        // Actions
        updateUser,
        updateProgress,
        updateSettings,
        updateStreak,
        addXP,
        loseHeart,
        resetHearts,
        completeLesson,
        activatePremium,
        checkPremium,
        resetAll,
        setCurrentHearts,

        // Auth pass-through
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        currentUser: auth.currentUser,
        userData: auth.userData,
        refreshUserData: auth.refreshUserData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export default AppContext;
