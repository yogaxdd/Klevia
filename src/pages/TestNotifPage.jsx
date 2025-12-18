import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import {
    requestNotificationPermission,
    getPermissionStatus,
    isNotificationSupported,
    showTestNotification,
    onForegroundMessage
} from '../services/notificationService';

function TestNotifPage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    const [status, setStatus] = useState({
        supported: false,
        permission: 'unknown',
        token: null,
        enabled: false
    });
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, {
            message,
            type,
            time: new Date().toLocaleTimeString()
        }]);
    };

    useEffect(() => {
        const checkStatus = async () => {
            addLog('Checking notification support...');
            const supported = await isNotificationSupported();
            const permission = getPermissionStatus();

            setStatus({
                supported,
                permission,
                token: userData?.fcmTokens?.[0] || null,
                enabled: userData?.notificationsEnabled || false
            });

            addLog(`Supported: ${supported}`, supported ? 'success' : 'error');
            addLog(`Permission: ${permission}`, permission === 'granted' ? 'success' : 'warning');
        };
        checkStatus();
    }, [userData]);

    useEffect(() => {
        // Listen for foreground messages
        const unsubscribe = onForegroundMessage((payload) => {
            addLog(`📬 Received: ${payload.notification?.title}`, 'success');
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    const handleRequestPermission = async () => {
        if (!currentUser) {
            addLog('Error: Not logged in', 'error');
            return;
        }

        setLoading(true);
        addLog('Requesting notification permission...');

        try {
            const result = await requestNotificationPermission(currentUser.uid);

            if (result.success) {
                addLog('✅ Permission granted!', 'success');
                addLog(`Token: ${result.token?.substring(0, 50)}...`, 'info');
                setStatus(prev => ({
                    ...prev,
                    permission: 'granted',
                    token: result.token,
                    enabled: true
                }));
            } else {
                addLog(`❌ Failed: ${result.error}`, 'error');
            }
        } catch (err) {
            addLog(`❌ Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTestNotification = () => {
        addLog('Sending test notification...');
        showTestNotification();
        addLog('✅ Test notification sent!', 'success');
    };

    const handleCopyToken = () => {
        if (status.token) {
            navigator.clipboard.writeText(status.token);
            addLog('📋 Token copied to clipboard!', 'success');
        }
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <span className="material-symbols-outlined text-text-main">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-text-main">Test Notifikasi 🔔</h1>
                        <p className="text-sm text-text-secondary">Debug push notifications</p>
                    </div>
                </div>

                {/* Status Card */}
                <Card className="mb-4">
                    <h2 className="font-bold text-text-main mb-3">Status</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Browser Support:</span>
                            <span className={status.supported ? 'text-green-600' : 'text-red-600'}>
                                {status.supported ? '✅ Yes' : '❌ No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Permission:</span>
                            <span className={
                                status.permission === 'granted' ? 'text-green-600' :
                                    status.permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                            }>
                                {status.permission}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Enabled:</span>
                            <span className={status.enabled ? 'text-green-600' : 'text-gray-500'}>
                                {status.enabled ? '✅ Yes' : '❌ No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Token:</span>
                            <span className={status.token ? 'text-green-600' : 'text-gray-500'}>
                                {status.token ? '✅ Saved' : '❌ None'}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <Card className="mb-4">
                    <h2 className="font-bold text-text-main mb-3">Actions</h2>
                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleRequestPermission}
                            disabled={loading || !currentUser}
                        >
                            {loading ? 'Loading...' : '🔓 Request Permission & Get Token'}
                        </Button>

                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={handleTestNotification}
                            disabled={status.permission !== 'granted'}
                        >
                            🔔 Send Test Notification
                        </Button>

                        {status.token && (
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={handleCopyToken}
                            >
                                📋 Copy FCM Token
                            </Button>
                        )}
                    </div>
                </Card>

                {/* FCM Token Display */}
                {status.token && (
                    <Card className="mb-4">
                        <h2 className="font-bold text-text-main mb-2">FCM Token</h2>
                        <p className="text-xs text-text-secondary break-all bg-gray-100 dark:bg-gray-800 p-2 rounded-lg font-mono">
                            {status.token}
                        </p>
                        <p className="text-xs text-text-secondary mt-2">
                            💡 Use this token in Firebase Console → Cloud Messaging → "Send test message"
                        </p>
                    </Card>
                )}

                {/* Logs */}
                <Card>
                    <h2 className="font-bold text-text-main mb-3">Logs</h2>
                    <div className="bg-gray-900 rounded-lg p-3 max-h-64 overflow-y-auto">
                        {logs.length === 0 ? (
                            <p className="text-gray-500 text-sm">No logs yet...</p>
                        ) : (
                            logs.map((log, idx) => (
                                <div key={idx} className="text-xs font-mono mb-1">
                                    <span className="text-gray-500">[{log.time}]</span>{' '}
                                    <span className={
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'error' ? 'text-red-400' :
                                                log.type === 'warning' ? 'text-yellow-400' :
                                                    'text-gray-300'
                                    }>
                                        {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default TestNotifPage;
