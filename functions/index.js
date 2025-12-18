/**
 * Firebase Cloud Functions for KLEVIA
 * Scheduled notifications and admin functions
 */

const { setGlobalOptions } = require("firebase-functions/v2/options");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();
const messaging = getMessaging();

// Set global options for all functions
setGlobalOptions({ maxInstances: 10, region: "asia-southeast1" });

/**
 * Scheduled function: Send morning reminder at 7 AM WIB (Jakarta time)
 * Cron: "0 7 * * *" = At 07:00 every day
 */
exports.sendMorningReminder = onSchedule(
    {
        schedule: "0 7 * * *",
        timeZone: "Asia/Jakarta",
        retryCount: 3,
    },
    async (event) => {
        logger.info("📬 Starting morning reminder notifications...");

        try {
            // Get all users with notifications enabled
            const usersSnapshot = await db
                .collection("users")
                .where("notificationsEnabled", "==", true)
                .get();

            if (usersSnapshot.empty) {
                logger.info("No users with notifications enabled");
                return;
            }

            const messages = [];
            let userCount = 0;

            usersSnapshot.forEach((doc) => {
                const user = doc.data();
                const tokens = user.fcmTokens || [];

                tokens.forEach((token) => {
                    messages.push({
                        token: token,
                        notification: {
                            title: "Klevia 📚",
                            body: "Selamat pagi! Yuk selesaikan daily quiz hari ini. 🌅",
                        },
                        data: {
                            url: "/daily-quiz",
                            type: "morning_reminder",
                        },
                        android: {
                            priority: "high",
                            notification: {
                                sound: "default",
                                clickAction: "FLUTTER_NOTIFICATION_CLICK",
                            },
                        },
                        webpush: {
                            notification: {
                                icon: "/Assets/logo.png",
                                badge: "/Assets/logo.png",
                            },
                            fcmOptions: {
                                link: "https://klevia.vercel.app/daily-quiz",
                            },
                        },
                    });
                });
                userCount++;
            });

            if (messages.length === 0) {
                logger.info("No FCM tokens to send");
                return;
            }

            logger.info(`Sending notifications to ${userCount} users (${messages.length} tokens)`);

            // Send notifications in batches (FCM limit: 500 per batch)
            const batchSize = 500;
            let successCount = 0;
            let failureCount = 0;

            for (let i = 0; i < messages.length; i += batchSize) {
                const batch = messages.slice(i, i + batchSize);
                const response = await messaging.sendEach(batch);
                successCount += response.successCount;
                failureCount += response.failureCount;

                // Log failed tokens for cleanup
                response.responses.forEach((res, idx) => {
                    if (!res.success) {
                        logger.warn(`Failed to send to token: ${batch[idx].token.substring(0, 20)}...`, res.error);
                    }
                });
            }

            logger.info(`✅ Morning reminder complete: ${successCount} success, ${failureCount} failed`);
        } catch (error) {
            logger.error("❌ Error sending morning reminder:", error);
            throw error;
        }
    }
);

/**
 * HTTP endpoint to manually trigger notifications (for testing)
 * Usage: POST https://<region>-<project>.cloudfunctions.net/sendTestNotification
 */
exports.sendTestNotification = onRequest(
    { cors: true },
    async (req, res) => {
        // Only allow POST
        if (req.method !== "POST") {
            res.status(405).send("Method not allowed");
            return;
        }

        const { userId, title, body } = req.body;

        if (!userId) {
            res.status(400).json({ error: "userId is required" });
            return;
        }

        try {
            // Get user's FCM tokens
            const userDoc = await db.collection("users").doc(userId).get();

            if (!userDoc.exists) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const user = userDoc.data();
            const tokens = user.fcmTokens || [];

            if (tokens.length === 0) {
                res.status(400).json({ error: "User has no FCM tokens" });
                return;
            }

            // Send notification
            const messages = tokens.map((token) => ({
                token: token,
                notification: {
                    title: title || "Klevia Test 🔔",
                    body: body || "Ini adalah test notification dari Klevia!",
                },
                data: {
                    url: "/test-notif",
                    type: "test",
                },
            }));

            const response = await messaging.sendEach(messages);

            res.json({
                success: true,
                sent: response.successCount,
                failed: response.failureCount,
            });
        } catch (error) {
            logger.error("Error sending test notification:", error);
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Streak reminder - Send at 8 PM to users who haven't completed daily quiz
 * Cron: "0 20 * * *" = At 20:00 every day
 */
exports.sendStreakReminder = onSchedule(
    {
        schedule: "0 20 * * *",
        timeZone: "Asia/Jakarta",
        retryCount: 3,
    },
    async (event) => {
        logger.info("🔥 Starting streak reminder notifications...");

        const today = new Date().toISOString().split("T")[0];

        try {
            // Get users with notifications enabled who haven't done daily quiz today
            const usersSnapshot = await db
                .collection("users")
                .where("notificationsEnabled", "==", true)
                .get();

            const messages = [];

            for (const doc of usersSnapshot.docs) {
                const user = doc.data();
                const tokens = user.fcmTokens || [];
                const lastQuizDate = user.dailyQuiz && user.dailyQuiz.lastCompleted;

                // Skip if already completed today
                if (lastQuizDate === today) continue;
                if (tokens.length === 0) continue;

                const currentStreak = (user.streak && user.streak.current) || 0;

                tokens.forEach((token) => {
                    messages.push({
                        token: token,
                        notification: {
                            title: "Jangan Putus Streak! 🔥",
                            body: currentStreak > 0
                                ? `Streak ${currentStreak} hari akan hilang! Selesaikan quiz sebelum tengah malam.`
                                : "Yuk mulai streak baru dengan daily quiz hari ini!",
                        },
                        data: {
                            url: "/daily-quiz",
                            type: "streak_reminder",
                        },
                    });
                });
            }

            if (messages.length === 0) {
                logger.info("No users need streak reminder");
                return;
            }

            const response = await messaging.sendEach(messages);
            logger.info(`✅ Streak reminder: ${response.successCount} success, ${response.failureCount} failed`);
        } catch (error) {
            logger.error("❌ Error sending streak reminder:", error);
            throw error;
        }
    }
);

