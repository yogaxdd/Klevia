// Firebase Cloud Messaging Service Worker
// This runs in the background to receive push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// These are safe to expose (same as client-side code)
firebase.initializeApp({
    apiKey: "AIzaSyCfdajcor0lTEKzUo2kvp133OaMqB5MccU",
    authDomain: "klevia-393cf.firebaseapp.com",
    projectId: "klevia-393cf",
    storageBucket: "klevia-393cf.firebasestorage.app",
    messagingSenderId: "972580965612",
    appId: "1:972580965612:web:5b3cde8e7c8badce63e9c9"
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in focus)
messaging.onBackgroundMessage((payload) => {
    console.log('📬 Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Klevia';
    const notificationOptions = {
        body: payload.notification?.body || 'Waktunya belajar! 📚',
        icon: '/Assets/logo.png',
        badge: '/Assets/logo.png',
        vibrate: [100, 50, 100],
        data: {
            url: payload.data?.url || '/',
            ...payload.data
        },
        actions: [
            { action: 'open', title: 'Buka Klevia' },
            { action: 'dismiss', title: 'Nanti' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If app is already open, focus it
                for (const client of clientList) {
                    if (client.url.includes('klevia') && 'focus' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }
                // Otherwise open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

console.log('🔥 Firebase Messaging Service Worker loaded');
