// KLEVIA Achievements Data
export const achievements = [
    // XP Milestones
    {
        id: 'xp_100',
        name: 'Pemula',
        description: 'Kumpulkan 100 XP',
        icon: 'star',
        category: 'xp',
        requirement: { type: 'xp', value: 100 },
        reward: 'Badge Pemula',
    },
    {
        id: 'xp_500',
        name: 'Penjelajah',
        description: 'Kumpulkan 500 XP',
        icon: 'explore',
        category: 'xp',
        requirement: { type: 'xp', value: 500 },
        reward: 'Badge Penjelajah',
    },
    {
        id: 'xp_1000',
        name: 'Petualang',
        description: 'Kumpulkan 1.000 XP',
        icon: 'hiking',
        category: 'xp',
        requirement: { type: 'xp', value: 1000 },
        reward: 'Badge Petualang',
    },
    {
        id: 'xp_5000',
        name: 'Master',
        description: 'Kumpulkan 5.000 XP',
        icon: 'military_tech',
        category: 'xp',
        requirement: { type: 'xp', value: 5000 },
        reward: 'Badge Master',
    },

    // Lesson Milestones
    {
        id: 'lesson_1',
        name: 'Langkah Pertama',
        description: 'Selesaikan 1 pelajaran',
        icon: 'footprint',
        category: 'lessons',
        requirement: { type: 'lessons', value: 1 },
        reward: 'Badge Langkah Pertama',
    },
    {
        id: 'lesson_5',
        name: 'Pembelajar',
        description: 'Selesaikan 5 pelajaran',
        icon: 'school',
        category: 'lessons',
        requirement: { type: 'lessons', value: 5 },
        reward: 'Badge Pembelajar',
    },
    {
        id: 'lesson_10',
        name: 'Rajin Belajar',
        description: 'Selesaikan 10 pelajaran',
        icon: 'auto_stories',
        category: 'lessons',
        requirement: { type: 'lessons', value: 10 },
        reward: 'Badge Rajin Belajar',
    },
    {
        id: 'lesson_25',
        name: 'Kutu Buku',
        description: 'Selesaikan 25 pelajaran',
        icon: 'menu_book',
        category: 'lessons',
        requirement: { type: 'lessons', value: 25 },
        reward: 'Badge Kutu Buku',
    },
    {
        id: 'lesson_50',
        name: 'Ahli',
        description: 'Selesaikan 50 pelajaran',
        icon: 'workspace_premium',
        category: 'lessons',
        requirement: { type: 'lessons', value: 50 },
        reward: 'Badge Ahli',
    },

    // Streak Milestones
    {
        id: 'streak_3',
        name: 'Semangat!',
        description: 'Raih streak 3 hari',
        icon: 'local_fire_department',
        category: 'streak',
        requirement: { type: 'streak', value: 3 },
        reward: 'Badge Semangat',
    },
    {
        id: 'streak_7',
        name: 'Konsisten',
        description: 'Raih streak 7 hari',
        icon: 'whatshot',
        category: 'streak',
        requirement: { type: 'streak', value: 7 },
        reward: 'Badge Konsisten',
    },
    {
        id: 'streak_14',
        name: 'Disiplin',
        description: 'Raih streak 14 hari',
        icon: 'rocket_launch',
        category: 'streak',
        requirement: { type: 'streak', value: 14 },
        reward: 'Badge Disiplin',
    },
    {
        id: 'streak_30',
        name: 'Legendaris',
        description: 'Raih streak 30 hari',
        icon: 'diamond',
        category: 'streak',
        requirement: { type: 'streak', value: 30 },
        reward: 'Badge Legendaris',
    },

    // Level Milestones
    {
        id: 'level_5',
        name: 'Naik Kelas',
        description: 'Capai Level 5',
        icon: 'trending_up',
        category: 'level',
        requirement: { type: 'level', value: 5 },
        reward: 'Badge Naik Kelas',
    },
    {
        id: 'level_10',
        name: 'Berkembang',
        description: 'Capai Level 10',
        icon: 'emoji_events',
        category: 'level',
        requirement: { type: 'level', value: 10 },
        reward: 'Badge Berkembang',
    },
    {
        id: 'level_20',
        name: 'Hebat',
        description: 'Capai Level 20',
        icon: 'stars',
        category: 'level',
        requirement: { type: 'level', value: 20 },
        reward: 'Badge Hebat',
    },

    // Perfect Score
    {
        id: 'perfect_1',
        name: 'Sempurna!',
        description: 'Raih nilai 100% di 1 pelajaran',
        icon: 'verified',
        category: 'special',
        requirement: { type: 'perfect', value: 1 },
        reward: 'Badge Sempurna',
    },
    {
        id: 'perfect_5',
        name: 'Jenius',
        description: 'Raih nilai 100% di 5 pelajaran',
        icon: 'psychology',
        category: 'special',
        requirement: { type: 'perfect', value: 5 },
        reward: 'Badge Jenius',
    },

    // Subject Mastery
    {
        id: 'master_matematika',
        name: 'Ahli Matematika',
        description: 'Selesaikan semua materi Matematika',
        icon: 'calculate',
        category: 'mastery',
        requirement: { type: 'subject_mastery', subject: 'matematika' },
        reward: 'Badge Ahli Matematika',
    },
    {
        id: 'master_ipa',
        name: 'Ahli IPA',
        description: 'Selesaikan semua materi IPA',
        icon: 'science',
        category: 'mastery',
        requirement: { type: 'subject_mastery', subject: 'ipa' },
        reward: 'Badge Ahli IPA',
    },
    {
        id: 'master_bahasa',
        name: 'Ahli Bahasa Indonesia',
        description: 'Selesaikan semua materi Bahasa Indonesia',
        icon: 'menu_book',
        category: 'mastery',
        requirement: { type: 'subject_mastery', subject: 'bahasa' },
        reward: 'Badge Ahli Bahasa Indonesia',
    },
    {
        id: 'master_english',
        name: 'Ahli Bahasa Inggris',
        description: 'Selesaikan semua materi Bahasa Inggris',
        icon: 'translate',
        category: 'mastery',
        requirement: { type: 'subject_mastery', subject: 'english' },
        reward: 'Badge Ahli Bahasa Inggris',
    },
    {
        id: 'grand_master',
        name: 'Grand Master',
        description: 'Selesaikan SEMUA materi di semua mata pelajaran',
        icon: 'workspace_premium',
        category: 'mastery',
        requirement: { type: 'all_mastery' },
        reward: 'Badge Grand Master 🏆',
    },
];

// Import lessons for mastery checking
import { lessons } from './lessons';

// Helper function to check if achievement is unlocked
export const checkAchievement = (achievement, userData) => {
    const { type, value, subject } = achievement.requirement;

    switch (type) {
        case 'xp':
            return (userData.xp || 0) >= value;
        case 'lessons':
            return (userData.lessonsCompleted || 0) >= value;
        case 'streak':
            return (userData.streak?.longestStreak || 0) >= value;
        case 'level':
            return (userData.level || 1) >= value;
        case 'perfect':
            // Count perfect scores from progress
            const userLessons = userData.progress?.lessons || {};
            const perfectCount = Object.values(userLessons).filter(
                l => l.completed && l.score === l.totalQuestions
            ).length;
            return perfectCount >= value;
        case 'subject_mastery':
            // Check if all lessons for this subject are completed
            const subjectLessons = lessons.filter(l => l.subject === subject);
            const completedSubject = subjectLessons.filter(
                l => userData.progress?.lessons?.[l.id]?.completed
            ).length;
            return subjectLessons.length > 0 && completedSubject >= subjectLessons.length;
        case 'all_mastery':
            // Check if ALL lessons in ALL subjects are completed
            const allCompleted = lessons.filter(
                l => userData.progress?.lessons?.[l.id]?.completed
            ).length;
            return lessons.length > 0 && allCompleted >= lessons.length;
        default:
            return false;
    }
};

// Get all achievements with unlock status
export const getAchievementsWithStatus = (userData) => {
    return achievements.map(achievement => ({
        ...achievement,
        unlocked: checkAchievement(achievement, userData),
    }));
};

// Get category label
export const getCategoryLabel = (category) => {
    const labels = {
        xp: 'XP',
        lessons: 'Pelajaran',
        streak: 'Streak',
        level: 'Level',
        special: 'Spesial',
        mastery: 'Penguasaan',
    };
    return labels[category] || category;
};
