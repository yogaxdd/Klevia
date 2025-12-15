import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Card from '../components/Card';

function StatisticsPage() {
    const navigate = useNavigate();
    const { userData } = useAuth();
    const [stats, setStats] = useState({
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lessonsCompleted: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0], // Last 7 days
    });

    useEffect(() => {
        if (userData) {
            // Calculate stats from userData
            const lessonsProgress = userData.progress?.lessons || {};
            let totalQuestions = 0;
            let correctAnswers = 0;

            // Calculate from lessons progress
            Object.values(lessonsProgress).forEach(lesson => {
                if (lesson.score !== undefined) {
                    totalQuestions += lesson.totalQuestions || 0;
                    correctAnswers += Math.round((lesson.score / 100) * (lesson.totalQuestions || 0));
                }
            });

            // Add wrong answers to total (they were answered but incorrectly)
            const wrongAnswersCount = userData.wrongAnswers?.length || 0;

            setStats({
                totalXP: userData.xp || 0,
                level: userData.level || 1,
                currentStreak: userData.streak?.currentStreak || 0,
                longestStreak: userData.streak?.longestStreak || 0,
                lessonsCompleted: userData.lessonsCompleted || 0,
                totalQuestions: totalQuestions + wrongAnswersCount,
                correctAnswers: correctAnswers,
                accuracy: totalQuestions > 0 ? Math.round((correctAnswers / (totalQuestions + wrongAnswersCount)) * 100) : 0,
                weeklyActivity: [3, 5, 2, 7, 4, 6, 8], // Placeholder - would need date tracking
            });
        }
    }, [userData]);

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date().getDay(); // 0 = Sunday

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary via-[#2fd165] to-emerald-500 text-white px-4 pt-8 pb-16 rounded-b-[2rem]">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold">Statistik</h1>
                        <div className="w-10" />
                    </div>

                    {/* Level Badge */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 mb-3">
                            <span className="text-4xl font-black">{stats.level}</span>
                        </div>
                        <p className="text-white/80 text-sm">Level Saat Ini</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalXP.toLocaleString()} XP</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="px-4 -mt-8 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-3">
                    {/* Streak Card */}
                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/30 mb-2">
                            <span className="material-symbols-outlined text-orange-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                local_fire_department
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-text-main">{stats.currentStreak}</p>
                        <p className="text-xs text-text-secondary">Hari Streak</p>
                    </Card>

                    {/* Longest Streak */}
                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
                            <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                trophy
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-text-main">{stats.longestStreak}</p>
                        <p className="text-xs text-text-secondary">Streak Terlama</p>
                    </Card>

                    {/* Lessons Completed */}
                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                            <span className="material-symbols-outlined text-blue-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                menu_book
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-text-main">{stats.lessonsCompleted}</p>
                        <p className="text-xs text-text-secondary">Pelajaran Selesai</p>
                    </Card>

                    {/* Accuracy */}
                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                            <span className="material-symbols-outlined text-green-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check_circle
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-text-main">{stats.accuracy}%</p>
                        <p className="text-xs text-text-secondary">Akurasi Jawaban</p>
                    </Card>
                </div>

                {/* Weekly Activity */}
                <Card className="mt-4 p-4">
                    <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                        Aktivitas Minggu Ini
                    </h3>
                    <div className="flex justify-between items-end h-32">
                        {stats.weeklyActivity.map((activity, index) => {
                            const isToday = index === today;
                            const maxActivity = Math.max(...stats.weeklyActivity, 1);
                            const height = (activity / maxActivity) * 100;

                            return (
                                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                    <div
                                        className={`w-6 rounded-full transition-all ${isToday ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    />
                                    <span className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-text-secondary'}`}>
                                        {dayNames[index]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Questions Stats */}
                <Card className="mt-4 p-4">
                    <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">quiz</span>
                        Statistik Soal
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Total Soal Dijawab</span>
                            <span className="font-bold text-text-main">{stats.totalQuestions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Jawaban Benar</span>
                            <span className="font-bold text-green-500">{stats.correctAnswers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary">Jawaban Salah</span>
                            <span className="font-bold text-red-500">{stats.totalQuestions - stats.correctAnswers}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.accuracy}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-text-secondary">
                                <span>0%</span>
                                <span>{stats.accuracy}% Akurasi</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default StatisticsPage;
