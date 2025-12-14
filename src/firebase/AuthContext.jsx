// Firebase Auth Context for KLEVIA - Full Firestore Mode
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from './config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Default user data for new users
const defaultUserData = {
    xp: 0,
    level: 1,
    hearts: 5,
    lessonsCompleted: 0,
    kelas: null,
    subject: null,
    isPremium: false,
    premiumExpiry: null,
    streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        streakFreezeUsed: false,
    },
    progress: {
        lessons: {},
    },
    wrongAnswers: [], // Store wrong answers for review
    profileCompleted: false,
    displayName: 'Pelajar',
    gender: null,
    birthDate: null,
    createdAt: null,
    updatedAt: null,
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setUserData(userSnap.data());
                    } else {
                        // Create new user document
                        const newUserData = {
                            ...defaultUserData,
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || 'Pelajar',
                            photoURL: user.photoURL,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        };
                        await setDoc(userRef, newUserData);
                        setUserData(newUserData);
                    }
                } catch (error) {
                    console.error('Firestore error:', error);
                    // Still set basic data from auth
                    setUserData({
                        ...defaultUserData,
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || 'Pelajar',
                        photoURL: user.photoURL,
                    });
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    };

    // Sign out
    const logout = async () => {
        try {
            await signOut(auth);
            setUserData(null);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    };

    // Update user data in Firestore
    const updateUserData = useCallback(async (updates) => {
        if (!currentUser) return { success: false };

        // Update local state immediately for responsiveness
        setUserData(prev => ({ ...prev, ...updates }));

        // Sync to Firestore
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Update user data error:', error);
            return { success: false, error: error.message };
        }
    }, [currentUser]);

    // Update specific nested fields (like progress.lessons)
    const updateProgress = useCallback(async (lessonId, lessonData) => {
        if (!currentUser) return { success: false };

        // Update local state
        setUserData(prev => ({
            ...prev,
            progress: {
                ...prev?.progress,
                lessons: {
                    ...prev?.progress?.lessons,
                    [lessonId]: lessonData,
                },
            },
        }));

        // Sync to Firestore
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                [`progress.lessons.${lessonId}`]: lessonData,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Update progress error:', error);
            return { success: false, error: error.message };
        }
    }, [currentUser]);

    // Update streak
    const updateStreak = useCallback(async (streakData) => {
        if (!currentUser) return { success: false };

        setUserData(prev => ({ ...prev, streak: streakData }));

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                streak: streakData,
                updatedAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error('Update streak error:', error);
            return { success: false, error: error.message };
        }
    }, [currentUser]);

    // Add XP
    const addXP = useCallback(async (amount) => {
        if (!currentUser || !userData) return;

        const isPremium = userData.isPremium && new Date(userData.premiumExpiry) > new Date();
        const finalAmount = isPremium ? amount * 2 : amount;
        const newXP = (userData.xp || 0) + finalAmount;
        const newLevel = Math.floor(newXP / 100) + 1;

        await updateUserData({ xp: newXP, level: newLevel });
        return { newXP, newLevel, isPremium };
    }, [currentUser, userData, updateUserData]);

    // Complete lesson
    const completeLesson = useCallback(async (lessonId, score, totalQuestions) => {
        if (!currentUser || !userData) return;

        const lessonData = { completed: true, score, totalQuestions };
        const newLessonsCompleted = (userData.lessonsCompleted || 0) + 1;

        // Update progress
        await updateProgress(lessonId, lessonData);

        // Update lessonsCompleted and streak
        const today = new Date().toDateString();
        const lastActive = userData.streak?.lastActiveDate;
        let newStreak = { ...userData.streak };

        if (lastActive !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastActive === yesterday) {
                newStreak.currentStreak = (newStreak.currentStreak || 0) + 1;
            } else {
                newStreak.currentStreak = 1;
            }
            newStreak.lastActiveDate = today;
            newStreak.longestStreak = Math.max(newStreak.longestStreak || 0, newStreak.currentStreak);
            newStreak.streakFreezeUsed = false;
        }

        await updateUserData({
            lessonsCompleted: newLessonsCompleted,
            streak: newStreak,
        });

        return { lessonData, newLessonsCompleted, newStreak };
    }, [currentUser, userData, updateProgress, updateUserData]);

    // Activate premium
    const activatePremium = useCallback(async (plan) => {
        if (!currentUser) return;

        let expiryDate = new Date();
        if (plan === 'monthly') {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (plan === 'yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        await updateUserData({
            isPremium: true,
            premiumExpiry: expiryDate.toISOString(),
        });
    }, [currentUser, updateUserData]);

    // Refresh user data from Firestore
    const refreshUserData = useCallback(async () => {
        if (!currentUser) return;

        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserData(userSnap.data());
            }
        } catch (error) {
            console.error('Refresh error:', error);
        }
    }, [currentUser]);

    const value = {
        currentUser,
        userData,
        loading,
        signInWithGoogle,
        logout,
        updateUserData,
        updateProgress,
        updateStreak,
        addXP,
        completeLesson,
        activatePremium,
        refreshUserData,
        isAuthenticated: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
