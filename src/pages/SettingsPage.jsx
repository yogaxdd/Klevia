import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../firebase/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import Button from '../components/Button';

function SettingsPage() {
    const navigate = useNavigate();
    const { settings, updateSettings, resetAll, user, updateUser } = useApp();
    const { currentUser, logout, isAuthenticated } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [showResetModal, setShowResetModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(user.name);

    const handleToggleSound = () => {
        updateSettings({ soundEnabled: !settings.soundEnabled });
    };

    const handleResetConfirm = () => {
        resetAll();
        setShowResetModal(false);
        navigate('/');
    };

    const handleLogout = async () => {
        await logout();
        resetAll();
        setShowLogoutModal(false);
        navigate('/');
    };

    const handleSaveName = () => {
        if (tempName.trim()) {
            updateUser({
                name: tempName.trim(),
                displayName: tempName.trim() // Keep displayName in sync with name
            });
        }
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-background pb-28">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <header className="px-6 pt-10 pb-6">
                    <h1 className="text-2xl font-bold text-text-main">Pengaturan</h1>
                    <p className="text-text-secondary">Kelola preferensi aplikasimu</p>
                </header>

                {/* Account Section */}
                <section className="px-6 mb-6">
                    <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
                        Akun
                    </h2>

                    <div className="flex flex-col gap-3">
                        {/* User Info Card */}
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isAuthenticated && currentUser?.photoURL ? (
                                        <img
                                            src={currentUser.photoURL}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                            <span className="material-symbols-outlined text-primary">person</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-text-secondary">Nama</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className="font-medium text-text-main border border-gray-200 rounded-lg px-2 py-1 text-sm w-40"
                                                autoFocus
                                            />
                                        ) : (
                                            <p className="font-medium text-text-main">{user.name}</p>
                                        )}
                                    </div>
                                </div>
                                {isEditing ? (
                                    <button
                                        onClick={handleSaveName}
                                        className="text-primary font-medium text-sm"
                                    >
                                        Simpan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-primary font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </Card>

                        {/* Email Info - only if logged in */}
                        {isAuthenticated && currentUser?.email && (
                            <Card>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                                        <span className="material-symbols-outlined text-blue-600">email</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary">Email</p>
                                        <p className="font-medium text-text-main">{currentUser.email}</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </section>

                {/* App Settings */}
                <section className="px-6 mb-6">
                    <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
                        Aplikasi
                    </h2>

                    <div className="flex flex-col gap-3">
                        {/* Sound Toggle */}
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                                        <span className="material-symbols-outlined text-blue-600">
                                            {settings.soundEnabled ? 'volume_up' : 'volume_off'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">Efek Suara</p>
                                        <p className="text-sm text-text-secondary">
                                            {settings.soundEnabled ? 'Aktif' : 'Nonaktif'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleSound}
                                    className={`
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                    ${settings.soundEnabled ? 'bg-primary' : 'bg-gray-300'}
                  `}
                                >
                                    <span
                                        className={`
                      inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform
                      ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}
                    `}
                                    />
                                </button>
                            </div>
                        </Card>

                        {/* Dark Mode Toggle */}
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                                        <span className={`material-symbols-outlined ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                            {isDarkMode ? 'dark_mode' : 'light_mode'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">Mode Gelap</p>
                                        <p className="text-sm text-text-secondary">
                                            {isDarkMode ? 'Aktif' : 'Nonaktif'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                    ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}
                  `}
                                >
                                    <span
                                        className={`
                      inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform
                      ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                    `}
                                    />
                                </button>
                            </div>
                        </Card>

                        {/* Change Class */}
                        <Card hoverable onClick={() => navigate('/select-class')}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                                        <span className="material-symbols-outlined text-orange-600">school</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">Kelas</p>
                                        <p className="text-sm text-text-secondary">
                                            {user.kelas ? `Kelas ${user.kelas}` : 'Pilih kelas'}
                                        </p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                            </div>
                        </Card>

                        {/* Change Subject */}
                        <Card hoverable onClick={() => navigate('/select-subject')}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                                        <span className="material-symbols-outlined text-purple-600">menu_book</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">Mata Pelajaran</p>
                                        <p className="text-sm text-text-secondary">
                                            {user.subject || 'Pilih mata pelajaran'}
                                        </p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="px-6 mb-6">
                    <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
                        Zona Bahaya
                    </h2>

                    <div className="flex flex-col gap-3">
                        {/* Logout - only if logged in */}
                        {isAuthenticated && (
                            <Card className="border-orange-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                                            <span className="material-symbols-outlined text-orange-600">logout</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-main">Keluar</p>
                                            <p className="text-sm text-text-secondary">Logout dari akun</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setShowLogoutModal(true)}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Reset Progress */}
                        <Card className="border-red-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                                        <span className="material-symbols-outlined text-red-600">delete_forever</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">Reset Progress</p>
                                        <p className="text-sm text-text-secondary">Hapus semua data belajar</p>
                                    </div>
                                </div>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setShowResetModal(true)}
                                >
                                    Reset
                                </Button>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* App Info */}
                <section className="px-6 py-8 text-center">
                    <p className="text-xs text-text-secondary">KLEVIA v2.0</p>
                    <p className="text-xs text-text-secondary mt-1">Belajar Jadi Mudah</p>
                </section>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
                    <Card className="max-w-sm w-full">
                        <div className="text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
                                <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Reset Progress?</h3>
                            <p className="text-text-secondary mb-6">
                                Semua data termasuk XP, level, dan progress pelajaran akan dihapus. Tindakan ini tidak bisa dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => setShowResetModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="danger"
                                    fullWidth
                                    onClick={handleResetConfirm}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
                    <Card className="max-w-sm w-full">
                        <div className="text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mx-auto mb-4">
                                <span className="material-symbols-outlined text-orange-600 text-3xl">logout</span>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Keluar dari Akun?</h3>
                            <p className="text-text-secondary mb-6">
                                Kamu akan keluar dari akun {currentUser?.email}. Progress lokal akan direset.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <BottomNav />
        </div>
    );
}

export default SettingsPage;
