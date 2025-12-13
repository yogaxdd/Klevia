import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { achievements, getAchievementsWithStatus, getCategoryLabel } from '../data/achievements';
import Card from '../components/Card';
import BottomNav from '../components/BottomNav';

function AchievementsPage() {
    const navigate = useNavigate();
    const { user, progress, streak } = useApp();
    const [activeCategory, setActiveCategory] = useState('all');

    // Build userData for checking achievements
    const userData = {
        xp: user.xp || 0,
        level: user.level || 1,
        lessonsCompleted: user.lessonsCompleted || 0,
        streak: streak,
        progress: progress,
    };

    const achievementsWithStatus = getAchievementsWithStatus(userData);

    // Filter by category
    const filteredAchievements = activeCategory === 'all'
        ? achievementsWithStatus
        : achievementsWithStatus.filter(a => a.category === activeCategory);

    // Count unlocked
    const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;
    const totalCount = achievementsWithStatus.length;

    const categories = [
        { id: 'all', label: 'Semua' },
        { id: 'xp', label: 'XP' },
        { id: 'lessons', label: 'Pelajaran' },
        { id: 'streak', label: 'Streak' },
        { id: 'level', label: 'Level' },
        { id: 'special', label: 'Spesial' },
        { id: 'mastery', label: 'Penguasaan' },
    ];

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center gap-4 px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-text-main">arrow_back</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-text-main">Pencapaian</h1>
                        <p className="text-sm text-text-secondary">
                            {unlockedCount} dari {totalCount} terbuka
                        </p>
                    </div>
                    {/* Trophy with count */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-xl">
                        <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                            emoji_events
                        </span>
                        <span className="font-bold text-yellow-600">{unlockedCount}</span>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Progress Overview */}
            <div className="px-4 py-4">
                <Card className="bg-gradient-to-br from-primary/10 to-green-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                                trophy
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-text-main">Progres Pencapaian</h3>
                            <div className="mt-2 h-3 bg-white rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all duration-500"
                                    style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                                />
                            </div>
                            <p className="text-sm text-text-secondary mt-1">
                                {Math.round((unlockedCount / totalCount) * 100)}% selesai
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Achievements Grid */}
            <div className="px-4 grid grid-cols-2 gap-3">
                {filteredAchievements.map((achievement, index) => (
                    <div
                        key={achievement.id}
                        className={`relative p-4 rounded-2xl border-2 transition-all animate-fadeInUp ${achievement.unlocked
                            ? 'bg-white border-primary/30 shadow-sm'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Unlocked Badge */}
                        {achievement.unlocked && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                        )}

                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${achievement.unlocked
                            ? 'bg-primary/20'
                            : 'bg-gray-200'
                            }`}>
                            <span
                                className={`material-symbols-outlined ${achievement.unlocked ? 'text-primary' : 'text-gray-400'
                                    }`}
                                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
                            >
                                {achievement.unlocked ? achievement.icon : 'lock'}
                            </span>
                        </div>

                        {/* Name & Description */}
                        <h4 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-text-main' : 'text-gray-400'
                            }`}>
                            {achievement.name}
                        </h4>
                        <p className={`text-xs ${achievement.unlocked ? 'text-text-secondary' : 'text-gray-400'
                            }`}>
                            {achievement.description}
                        </p>

                        {/* Category Tag */}
                        <div className={`mt-2 px-2 py-1 rounded-full text-xs inline-block ${achievement.unlocked
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-200 text-gray-400'
                            }`}>
                            {getCategoryLabel(achievement.category)}
                        </div>
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}

export default AchievementsPage;
