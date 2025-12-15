import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../firebase/AuthContext';
import { lessons } from '../data/allLessons';
import { subscribeToRoom } from '../services/battleService';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import StreakDisplay from '../components/StreakDisplay';

function HomePage() {
    const navigate = useNavigate();
    const { user, progress, streak } = useApp();
    const { currentUser, userData } = useAuth();

    const [dailyQuizDone, setDailyQuizDone] = useState(false);
    const [countdown, setCountdown] = useState('');
    const [activeBattle, setActiveBattle] = useState(null);

    // Check if daily quiz is done and calculate countdown
    useEffect(() => {
        const checkDailyQuiz = () => {
            const today = new Date().toISOString().split('T')[0];
            const lastQuizDate = userData?.dailyQuiz?.lastCompleted;

            if (lastQuizDate === today) {
                setDailyQuizDone(true);

                // Calculate time until midnight
                const now = new Date();
                const midnight = new Date();
                midnight.setHours(24, 0, 0, 0);

                const diff = midnight - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setDailyQuizDone(false);
                setCountdown('');
            }
        };

        checkDailyQuiz();
        const interval = setInterval(checkDailyQuiz, 1000);
        return () => clearInterval(interval);
    }, [userData]);

    // Check for active battle
    useEffect(() => {
        const savedRoom = localStorage.getItem('klevia_active_battle');
        if (savedRoom && currentUser) {
            const { roomCode } = JSON.parse(savedRoom);
            const unsubscribe = subscribeToRoom(roomCode, (roomData) => {
                if (roomData && (roomData.status === 'waiting' || roomData.status === 'playing')) {
                    if (roomData.hostId === currentUser.uid || roomData.guestId === currentUser.uid) {
                        setActiveBattle({ roomCode, status: roomData.status });
                    } else {
                        localStorage.removeItem('klevia_active_battle');
                        setActiveBattle(null);
                    }
                } else {
                    localStorage.removeItem('klevia_active_battle');
                    setActiveBattle(null);
                }
                unsubscribe();
            });
        }
    }, [currentUser]);

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
            biologi: 'Biologi',
            kimia: 'Kimia',
            fisika: 'Fisika',
            ekonomi: 'Ekonomi',
            sosiologi: 'Sosiologi',
            geografi: 'Geografi',
            sejarah: 'Sejarah',
            pkn: 'PKn',
            informatika: 'Informatika',
            tka: 'TKA',
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
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-2xl font-bold text-text-main leading-none truncate max-w-[180px]">{user.name}</h1>
                            {isPremium && (
                                <span
                                    className="material-symbols-outlined text-primary flex-shrink-0"
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
                            className={`h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-sm cursor-pointer overflow-hidden ${isPremium
                                ? 'bg-gradient-to-br from-primary/20 to-green-100 border-primary/30'
                                : 'bg-primary/20 border-white'
                                }`}
                            onClick={() => navigate('/profile')}
                        >
                            {currentUser?.photoURL ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className={`material-symbols-outlined text-2xl ${isPremium ? 'text-primary' : 'text-primary'}`}>person</span>
                            )}
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

                {/* Active Battle Reconnect Banner */}
                {activeBattle && (
                    <section className="px-6 py-2">
                        <button
                            onClick={() => {
                                if (activeBattle.status === 'playing') {
                                    navigate(`/battle/game/${activeBattle.roomCode}`);
                                } else {
                                    navigate(`/battle/waiting/${activeBattle.roomCode}`);
                                }
                            }}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-left relative overflow-hidden transition-transform active:scale-[0.98] animate-pulse"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-white"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            swords
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">⚔️ Match 1v1 Berjalan!</h4>
                                        <p className="text-white/80 text-xs">Tap untuk reconnect • Room: {activeBattle.roomCode}</p>
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
                            {/* Subject Banner Image */}
                            {(() => {
                                const bannerMap = {
                                    bahasa: '/Assets/bind.jpeg',
                                    english: '/Assets/bing.jpeg',
                                    ipa: '/Assets/ipa.png',
                                    matematika: '/Assets/mtk.jpeg',
                                    biologi: '/Assets/biologi.png',
                                    kimia: '/Assets/kimia.png',
                                    fisika: '/Assets/fisika.png',
                                    ekonomi: '/Assets/ekonomi.png',
                                    sosiologi: '/Assets/sosiologi.png',
                                    geografi: '/Assets/geografi.png',
                                    sejarah: '/Assets/sejarah.png',
                                    pkn: '/Assets/pkn.png',
                                    informatika: '/Assets/informatika.png',
                                    tka: '/Assets/tka.png',
                                };
                                const bannerSrc = bannerMap[user.subject];
                                if (bannerSrc) {
                                    return <img src={bannerSrc} alt={getSubjectLabel(user.subject)} className="absolute inset-0 w-full h-full object-cover" />;
                                }
                                return null;
                            })()}

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
                            className={`flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition-transform border border-transparent ${dailyQuizDone
                                ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60'
                                : 'bg-blue-50 dark:bg-blue-900/30 active:scale-95 hover:border-blue-200 dark:hover:border-blue-700'
                                }`}
                            onClick={() => !dailyQuizDone && navigate('/daily-quiz')}
                            disabled={dailyQuizDone}
                        >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-sm ${dailyQuizDone ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'
                                }`}>
                                <span className="material-symbols-outlined">
                                    {dailyQuizDone ? 'check_circle' : 'quiz'}
                                </span>
                            </div>
                            <div>
                                <h4 className={`font-bold leading-tight ${dailyQuizDone ? 'text-gray-500' : 'text-text-main'}`}>
                                    {dailyQuizDone ? 'Selesai!' : 'Kuis Harian'}
                                </h4>
                                <p className={`text-xs mt-1 ${dailyQuizDone ? 'text-gray-400' : 'text-text-secondary'}`}>
                                    {dailyQuizDone ? `Buka: ${countdown}` : '5 soal, +100 XP'}
                                </p>
                            </div>
                        </button>

                        <button
                            className="flex flex-col items-start gap-3 rounded-2xl bg-orange-50 dark:bg-orange-900/30 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-orange-200 dark:hover:border-orange-700"
                            onClick={() => navigate('/levels')}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-orange-600 dark:text-orange-400 shadow-sm">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main leading-tight">Mulai Belajar</h4>
                                <p className="text-xs text-text-secondary mt-1">Pilih level yang ingin kamu coba</p>
                            </div>
                        </button>

                        <button
                            className="flex flex-col items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-900/30 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-amber-200 dark:hover:border-amber-700"
                            onClick={() => navigate('/leaderboard')}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-amber-600 dark:text-amber-400 shadow-sm">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main leading-tight">Leaderboard</h4>
                                <p className="text-xs text-text-secondary mt-1">Lihat peringkatmu</p>
                            </div>
                        </button>

                        <button
                            className="flex flex-col items-start gap-3 rounded-2xl bg-purple-50 dark:bg-purple-900/30 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                            onClick={() => nextLesson && navigate(`/practice/${nextLesson.id}`)}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-purple-600 dark:text-purple-400 shadow-sm">
                                <span className="material-symbols-outlined">fitness_center</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main leading-tight">Mode Latihan</h4>
                                <p className="text-xs text-text-secondary mt-1">Tanpa nyawa</p>
                            </div>
                        </button>

                        {/* Quiz Battle 1v1 */}
                        <button
                            className="flex flex-col items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-900/30 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-700"
                            onClick={() => navigate('/battle')}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-red-600 dark:text-red-400 shadow-sm">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>swords</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main leading-tight">Battle 1v1</h4>
                                <p className="text-xs text-text-secondary mt-1">Tantang temanmu!</p>
                            </div>
                        </button>

                        {/* Review Wrong Answers Button - only show if there are wrong answers */}
                        {(userData?.wrongAnswers?.length || 0) > 0 && (
                            <button
                                className="flex flex-col items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-900/30 p-4 text-left transition-transform active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-700"
                                onClick={() => navigate('/review-wrong')}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-red-600 dark:text-red-400 shadow-sm relative">
                                    <span className="material-symbols-outlined">replay</span>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {userData?.wrongAnswers?.length}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main leading-tight">Review Salah</h4>
                                    <p className="text-xs text-text-secondary mt-1">Pelajari kembali</p>
                                </div>
                            </button>
                        )}
                    </div>
                </section>

                {/* Stats */}
                <section className="px-6 py-4">
                    <button
                        onClick={() => navigate('/statistics')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <h2 className="text-lg font-bold text-text-main">Statistikmu</h2>
                        <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:underline">
                            Lihat detail
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </button>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <Card className="text-center p-2">
                            <div className="text-lg font-bold text-primary truncate">{user.xp || 0}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">XP</div>
                        </Card>
                        <Card className="text-center p-2">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">{user.lessonsCompleted || 0}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">Pelajaran</div>
                        </Card>
                        <Card className="text-center p-2">
                            <div className="text-lg font-bold text-orange-600 dark:text-orange-400 truncate">{streak.currentStreak || 0}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">Streak</div>
                        </Card>
                        <Card className="text-center p-2">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 truncate">{user.level || 1}</div>
                            <div className="text-[10px] text-text-secondary mt-0.5">Level</div>
                        </Card>
                    </div>

                    {/* Weekly Activity Mini Chart */}
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                            Aktivitas Minggu Ini
                        </h3>
                        <div className="flex justify-between items-end h-16">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => {
                                const isToday = index === new Date().getDay();
                                // Get activity from userData or default to 0
                                const weeklyActivity = userData?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];
                                const activity = weeklyActivity[index] || 0;
                                const maxActivity = Math.max(...weeklyActivity, 1);
                                const height = activity > 0 ? (activity / maxActivity) * 100 : 0;

                                return (
                                    <div key={day} className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className={`w-4 rounded-full transition-all ${isToday ? 'bg-primary' : activity > 0 ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                            style={{ height: `${Math.max(height, activity > 0 ? 15 : 5)}%` }}
                                        />
                                        <span className={`text-[10px] ${isToday ? 'font-bold text-primary' : 'text-text-secondary'}`}>
                                            {day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </section>
            </div>

            <BottomNav />
        </div>
    );
}

export default HomePage;
