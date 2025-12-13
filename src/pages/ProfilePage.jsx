import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAchievementsWithStatus } from '../data/achievements';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';

function ProfilePage() {
    const navigate = useNavigate();
    const { user, streak, progress } = useApp();

    const isPremium = user.isPremium && new Date(user.premiumExpiry) > new Date();

    // Get achievements status
    const userData = {
        xp: user.xp || 0,
        level: user.level || 1,
        lessonsCompleted: user.lessonsCompleted || 0,
        streak: streak,
        progress: progress,
    };
    const achievementsWithStatus = getAchievementsWithStatus(userData);
    const unlockedAchievements = achievementsWithStatus.filter(a => a.unlocked);
    const lockedAchievements = achievementsWithStatus.filter(a => !a.unlocked);

    // Show up to 3 achievements (unlocked first, then next to unlock)
    const previewAchievements = [
        ...unlockedAchievements.slice(-2), // Last 2 unlocked
        ...lockedAchievements.slice(0, 1), // Next 1 to unlock
    ].slice(0, 3);

    const getKelasLabel = (kelas) => {
        return kelas ? `Kelas ${kelas}` : 'Belum dipilih';
    };

    const getSubjectLabel = (subject) => {
        const labels = {
            matematika: 'Matematika',
            ipa: 'IPA',
            bahasa: 'Bahasa Indonesia',
            english: 'Bahasa Inggris',
        };
        return labels[subject] || 'Belum dipilih';
    };

    const xpToNextLevel = 100 - (user.xp % 100);
    const progressPercentage = user.xp % 100;

    return (
        <div className="min-h-screen bg-background pb-28">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <header className="px-6 pt-10 pb-6 text-center relative">
                    {/* Premium Badge Banner - Clickable */}
                    {isPremium && (
                        <button
                            onClick={() => navigate('/premium')}
                            className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-primary to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                workspace_premium
                            </span>
                            PREMIUM
                        </button>
                    )}

                    {/* Avatar */}
                    <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full mx-auto border-4 shadow-lg ${isPremium
                        ? 'bg-gradient-to-br from-primary/20 to-green-100 border-primary/30'
                        : 'bg-primary/20 border-white'
                        }`}>
                        <span
                            className={`material-symbols-outlined ${isPremium ? 'text-yellow-600' : 'text-primary'}`}
                            style={{ fontSize: '48px' }}
                        >
                            person
                        </span>
                    </div>

                    {/* Name with Crown */}
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-2xl font-bold text-text-main">{user.name}</h1>
                        {isPremium && (
                            <span
                                className="material-symbols-outlined text-primary"
                                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
                            >
                                crown
                            </span>
                        )}
                    </div>

                    {/* Class & Subject */}
                    <div className="flex items-center justify-center gap-2 text-text-secondary mt-1">
                        <span className="text-sm">{getKelasLabel(user.kelas)}</span>
                        <span>•</span>
                        <span className="text-sm">{getSubjectLabel(user.subject)}</span>
                    </div>

                    {/* Edit Profile & Premium Buttons */}
                    <div className="flex items-center justify-center gap-3 mt-3">
                        <button
                            onClick={() => navigate('/settings')}
                            className="text-sm text-primary font-medium hover:underline"
                        >
                            Edit Profil
                        </button>
                        {!isPremium && (
                            <>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={() => navigate('/premium')}
                                    className="text-sm font-medium text-yellow-600 hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        crown
                                    </span>
                                    Go Premium
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {/* Level Progress Section */}
                <section className="px-6 mb-6">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-text-main">Level {user.level}</h3>
                                <p className="text-sm text-text-secondary">
                                    {xpToNextLevel} XP lagi ke level berikutnya
                                    {isPremium && <span className="text-yellow-600 font-bold ml-1">(2x XP aktif!)</span>}
                                </p>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isPremium ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-primary/20'
                                }`}>
                                <span
                                    className={`material-symbols-outlined ${isPremium ? 'text-yellow-600' : 'text-primary'}`}
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    workspace_premium
                                </span>
                            </div>
                        </div>
                        <ProgressBar value={progressPercentage} max={100} size="md" showLabel />
                    </Card>
                </section>

                {/* Streak Card - New Featured Section */}
                <section className="px-6 mb-6">
                    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                                    <span
                                        className="material-symbols-outlined text-orange-500"
                                        style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
                                    >
                                        local_fire_department
                                    </span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">{streak.currentStreak || 0} Hari</div>
                                    <p className="text-sm text-text-secondary">Streak saat ini</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-text-main">{streak.longestStreak || 0}</div>
                                <p className="text-xs text-text-secondary">Terpanjang</p>
                            </div>
                        </div>
                        {isPremium && !streak.streakFreezeUsed && (
                            <div className="mt-3 pt-3 border-t border-orange-200 flex items-center gap-2 text-sm text-blue-600">
                                <span className="material-symbols-outlined text-sm">ac_unit</span>
                                <span>Streak Freeze tersedia hari ini</span>
                            </div>
                        )}
                    </Card>
                </section>

                {/* Statistics Grid */}
                <section className="px-6">
                    <h2 className="text-lg font-bold text-text-main mb-3">Statistik</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 mx-auto mb-3">
                                <span className="material-symbols-outlined text-primary">bolt</span>
                            </div>
                            <div className="text-2xl font-bold text-text-main">{user.xp || 0}</div>
                            <div className="text-sm text-text-secondary">Total XP</div>
                        </Card>

                        <Card className="text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mx-auto mb-3">
                                <span className="material-symbols-outlined text-blue-600">menu_book</span>
                            </div>
                            <div className="text-2xl font-bold text-text-main">{user.lessonsCompleted || 0}</div>
                            <div className="text-sm text-text-secondary">Pelajaran Selesai</div>
                        </Card>

                        <Card className="text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 mx-auto mb-3">
                                <span className="material-symbols-outlined text-orange-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    local_fire_department
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-text-main">{streak.currentStreak || 0}</div>
                            <div className="text-sm text-text-secondary">Hari Beruntun</div>
                        </Card>

                        <Card className="text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 mx-auto mb-3">
                                <span className="material-symbols-outlined text-purple-600">emoji_events</span>
                            </div>
                            <div className="text-2xl font-bold text-text-main">{user.level || 1}</div>
                            <div className="text-sm text-text-secondary">Level</div>
                        </Card>
                    </div>
                </section>

                {/* Achievements Preview */}
                <section className="px-6 py-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-text-main">
                            Pencapaian
                            <span className="ml-2 text-sm font-normal text-text-secondary">
                                {unlockedAchievements.length}/{achievementsWithStatus.length}
                            </span>
                        </h2>
                        <button
                            onClick={() => navigate('/achievements')}
                            className="text-sm text-primary font-medium flex items-center gap-1"
                        >
                            Lihat Semua
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {previewAchievements.map((achievement) => (
                            <Card
                                key={achievement.id}
                                className={`flex items-center gap-4 ${!achievement.unlocked ? 'opacity-60' : ''}`}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${achievement.unlocked ? 'bg-primary/20' : 'bg-gray-200'
                                    }`}>
                                    <span
                                        className={`material-symbols-outlined ${achievement.unlocked ? 'text-primary' : 'text-gray-400'}`}
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        {achievement.unlocked ? achievement.icon : 'lock'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-main">{achievement.name}</h4>
                                    <p className="text-sm text-text-secondary">{achievement.description}</p>
                                </div>
                                {achievement.unlocked ? (
                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        check_circle
                                    </span>
                                ) : (
                                    <span className="material-symbols-outlined text-gray-300">lock</span>
                                )}
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Premium CTA if not premium */}
                {!isPremium && (
                    <section className="px-6 pb-6">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => navigate('/premium')}
                            className="bg-gradient-to-r from-primary to-green-600"
                        >
                            <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
                            Upgrade ke Premium
                        </Button>
                    </section>
                )}
            </div>

            <BottomNav />
        </div>
    );
}

export default ProfilePage;

