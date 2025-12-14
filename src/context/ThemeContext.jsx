import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const { userData, updateUserData } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme preference
    useEffect(() => {
        // First check user preference from Firestore
        if (userData?.preferences?.darkMode !== undefined) {
            setIsDarkMode(userData.preferences.darkMode);
        } else {
            // Fallback to system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, [userData]);

    // Apply theme to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = async () => {
        const newValue = !isDarkMode;
        setIsDarkMode(newValue);

        // Save to Firestore
        if (updateUserData) {
            await updateUserData({
                preferences: {
                    ...userData?.preferences,
                    darkMode: newValue
                }
            });
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
