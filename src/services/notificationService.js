// Push Notification Service using Firebase Cloud Messaging
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import app from '../firebase/config';

// VAPID Key from Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BKBmA70eUUysC5gX2AMqBCJFdX0zRxbjtgDlvlaKNEZIZKczBjy-lT7XVt2pxlrmDQAPs2jxUGLaF0cc8PXWw5Q';

let messaging = null;

/**
 * Initialize Firebase Messaging (only if supported)
 */
export async function initMessaging() {
    try {
        const supported = await isSupported();
        if (!supported) {
            console.log('📱 Push notifications not supported in this browser');
            return null;
        }
        messaging = getMessaging(app);
        return messaging;
    } catch (error) {
        console.error('Failed to initialize messaging:', error);
        return null;
    }
}

/**
 * Check if notifications are supported
 */
export async function isNotificationSupported() {
    if (!('Notification' in window)) return false;
    if (!('serviceWorker' in navigator)) return false;
    return await isSupported();
}

/**
 * Get current notification permission status
 */
export function getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'granted', 'denied', or 'default'
}

/**
 * Request notification permission and get FCM token
 * @param {string} userId - Current user's UID
 * @returns {Promise<{success: boolean, token?: string, error?: string}>}
 */
export async function requestNotificationPermission(userId) {
    try {
        // Check browser support
        if (!await isNotificationSupported()) {
            return { success: false, error: 'Browser tidak mendukung notifikasi' };
        }

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            return { success: false, error: 'Izin notifikasi ditolak' };
        }

        // Initialize messaging if not already done
        if (!messaging) {
            messaging = await initMessaging();
        }

        if (!messaging) {
            return { success: false, error: 'Gagal inisialisasi messaging' };
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('📱 Service Worker registered:', registration);

        // Get FCM token
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            return { success: false, error: 'Gagal mendapatkan token FCM' };
        }

        console.log('🔑 FCM Token:', token);

        // Save token to Firestore
        await saveFCMToken(userId, token);

        return { success: true, token };
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save FCM token to user's document in Firestore
 * @param {string} userId 
 * @param {string} token 
 */
export async function saveFCMToken(userId, token) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            fcmTokens: arrayUnion(token),
            notificationsEnabled: true,
            lastTokenUpdate: new Date().toISOString()
        });
        console.log('✅ FCM Token saved to Firestore');
    } catch (error) {
        console.error('Error saving FCM token:', error);
        throw error;
    }
}

/**
 * Remove FCM token (when user disables notifications)
 * @param {string} userId 
 * @param {string} token 
 */
export async function removeFCMToken(userId, token) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            fcmTokens: arrayRemove(token),
            notificationsEnabled: false
        });
        console.log('✅ FCM Token removed from Firestore');
    } catch (error) {
        console.error('Error removing FCM token:', error);
    }
}

/**
 * Disable notifications for user
 * @param {string} userId 
 */
export async function disableNotifications(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            notificationsEnabled: false
        });
        console.log('🔕 Notifications disabled');
    } catch (error) {
        console.error('Error disabling notifications:', error);
    }
}

/**
 * Set up listener for foreground messages
 * @param {Function} callback - Called when message received
 */
export function onForegroundMessage(callback) {
    if (!messaging) {
        console.warn('Messaging not initialized');
        return () => { };
    }

    return onMessage(messaging, (payload) => {
        console.log('📬 Foreground message received:', payload);

        // Show notification manually for foreground
        if (Notification.permission === 'granted') {
            const { title, body } = payload.notification || {};
            new Notification(title || 'Klevia', {
                body: body || 'Ada pesan baru!',
                icon: '/Assets/logo.png'
            });
        }

        if (callback) callback(payload);
    });
}

/**
 * Send a test notification (for development)
 * Note: In production, notifications should be sent from server/Cloud Functions
 */
export function showTestNotification() {
    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
    }

    new Notification('Klevia 📚', {
        body: 'Waktunya belajar! Yuk selesaikan daily quiz kamu hari ini.',
        icon: '/Assets/logo.png',
        vibrate: [100, 50, 100]
    });
}
