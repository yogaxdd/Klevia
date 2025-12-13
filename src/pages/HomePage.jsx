import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { lessons } from '../data/lessons';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import StreakDisplay from '../components/StreakDisplay';

function HomePage() {
    const navigate = useNavigate();
    const { user, progress, streak } = useApp();

    const isPremium = user.isPremium && new Date(user.premiumExpiry) > new Date();

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const getSubjectLabel = (subject) => {
        const labels = {
            matematika: 'Matematika',
            ipa: 'IPA',
            bahasa: 'Bahasa Indonesia',
            english: 'Bahasa Inggris',
        };
        return labels[subject] || 'Pelajaran';
    };

    // Get lessons for current subject AND grade (kelas)
    const subjectLessons = lessons
        .filter(l => l.subject === user.subject && l.grade === user.kelas)
        .sort((a, b) => a.order - b.order);

    // Calculate progress
    const completedLessons = subjectLessons.filter(
        l => progress.lessons?.[l.id]?.completed
    ).length;
    const totalLessons = subjectLessons.length;
    const progressPercent = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Find next lesson to continue
    const nextLesson = subjectLessons.find(
        l => !progress.lessons?.[l.id]?.completed
    ) || subjectLessons[0];

    return (
        <div className="min-h-screen bg-background pb-28">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between px-6 pt-10 pb-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <p className="text-sm text-text-secondary font-medium">{getGreeting()},</p>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-text-main leading-none">{user.name}</h1>
                            {isPremium && (
                                <span
                                    className="material-symbols-outlined text-primary"
                                    style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                                    title="Premium Member"
                                >
                                    crown
                                </span>
                            )}
                        </div>

                        {/* Level & Streak */}
                        <div className="flex items-center gap-4 mt-1.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-bold text-green-800">
                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    workspace_premium
                                </span>
                                Level {user.level || 1}
                            </span>
                            <StreakDisplay size="sm" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-text-secondary">{user.xp || 0} XP</span>
                                {isPremium && (
                                    <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">2x</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="flex gap-3 items-center">
                        <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-sm cursor-pointer ${isPremium
                                ? 'bg-gradient-to-br from-primary/20 to-green-100 border-primary/30'
                                : 'bg-primary/20 border-white'
                                }`}
                            onClick={() => navigate('/profile')}
                        >
                            <span className={`material-symbols-outlined text-2xl ${isPremium ? 'text-primary' : 'text-primary'}`}>person</span>
                        </div>
                    </div>
                </header>

                {/* Premium Banner - only show if not premium */}
                {!isPremium && (
                    <section className="px-6 py-2">
                        <button
                            onClick={() => navigate('/premium')}
                            className="w-full bg-gradient-to-r from-primary to-green-600 rounded-2xl p-4 text-left relative overflow-hidden transition-transform active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-white"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            crown
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Upgrade ke Premium</h4>
                                        <p className="text-white/80 text-xs">2x XP • ❤️ Unlimited • 🔥 Streak Freeze</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-white">arrow_forward</span>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                            <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/10 rounded-full" />
                        </button>
                    </section>
                )}

                {/* Main Subject Hero Card */}
                <section className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-text-main">Lanjut Belajar</h2>
                        <button
                            className="text-sm font-medium text-primary hover:opacity-80"
                            onClick={() => navigate('/levels')}
                        >
                            Lihat Semua
                        </button>
                    </div>

                    <Card padding="none" className="overflow-hidden">
                        {/* Card Image with Subject Mascot */}
                        <div className="relative h-44 w-full bg-gradient-to-br from-primary/30 to-primary/10">
                            {/* Subject Mascot Image */}
                            {user.subject === 'bahasa' && (
                                <img src="/Assets/bind.jpeg" alt="Bahasa Indonesia" className="absolute inset-0 w-full h-full object-cover" />
                            )}
                            {user.subject === 'english' && (
                                <img src="/Assets/bing.jpeg" alt="Bahasa Inggris" className="absolute inset-0 w-full h-full object-cover" />
                            )}
                            {user.subject === 'ipa' && (
                                <img src="/Assets/ipa.png" alt="IPA" className="absolute inset-0 w-full h-full object-cover" />
                            )}
                            {user.subject === 'matematika' && (
                                <img src="/Assets/mtk.jpeg" alt="Matematika" className="absolute inset-0 w-full h-full object-cover" />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute top-4 right-4 rounded-lg bg-white/20 backdrop-blur-md px-2 py-1 text-xs font-bold text-white border border-white/30">
                                {getSubjectLabel(user.subject)}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        play_circle
                                    </span>
                                    {isPremium && (
                                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">2x XP</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">
                                    {nextLesson?.title || 'Pengenalan Aljabar'}
                                </h3>
                                <p className="text-sm opacity-90 font-light mt-0.5">
                                    Pelajaran {nextLesson?.order || 1} dari {totalLessons} • {nextLesson?.questionsCount || 5} soal
                                </p>
                            </div>
                        </div>

                        {/* Card Action */}
                        <div className="p-4 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="mb-1.5 flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Progress Pelajaran</span>
                                    <span className="text-text-main">{progressPercent}%</span>
                                </div>
                                <ProgressBar value={progressPercent} max={100} size="md" />
                            </div>
                            <Button
                                variant="primary"
                                size="md"
                                icon="arrow_forward"
                                onClick={() => nextLesson ? navigate(`/lesson/${nextLesson.id}`) : navigate('/levels')}
                            >
                                Lanjut
                            </Button>
                        </div>
                    </Card>
                </section>

                {/* Quick Actions */}
                <section className="px-6 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex flex-col items-start gap-3 rounded-2xl bg-blue-50 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-blue-200"
                            onClick={() => navigate('/levels')}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                                <span className="material-symbols-outlined">quiz</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main leading-tight">Kuis Harian</h4>
                                <p className="text-xs text-text-secondary mt-1">Asah kemampuanmu</p>
                            </div>
                        </button>

                        <button
                            className="flex flex-col items-start gap-3 rounded-2xl bg-orange-50 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-orange-200"
                            onClick={() => navigate('/levels')}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main leading-tight">Ringkasan</h4>
                                <p className="text-xs text-text-secondary mt-1">Review materi</p>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Stats */}
                <section className="px-6 py-4">
                    <h2 className="text-lg font-bold mb-3 text-text-main">Statistikmu</h2>
                    <div className="grid grid-cols-4 gap-3">
                        <Card className="text-center p-3">
                            <div className="text-xl font-bold text-primary">{user.xp || 0}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">XP</div>
                        </Card>
                        <Card className="text-center p-3">
                            <div className="text-xl font-bold text-blue-600">{user.lessonsCompleted || 0}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">Pelajaran</div>
                        </Card>
                        <Card className="text-center p-3">
                            <div className="text-xl font-bold text-orange-600">{streak.currentStreak || 0}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">Streak</div>
                        </Card>
                        <Card className="text-center p-3">
                            <div className="text-xl font-bold text-purple-600">{user.level || 1}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">Level</div>
                        </Card>
                    </div>
                </section>
            </div>

            <BottomNav />
        </div>
    );
}

export default HomePage;
