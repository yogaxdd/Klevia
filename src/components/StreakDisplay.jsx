import { useApp } from '../context/AppContext';

function StreakDisplay({ size = 'md', showLabel = true }) {
    const { streak, user } = useApp();

    const isPremium = user.isPremium && new Date(user.premiumExpiry) > new Date();
    const currentStreak = streak.currentStreak || 0;

    const sizeClasses = {
        sm: 'text-sm gap-1',
        md: 'text-base gap-1.5',
        lg: 'text-lg gap-2',
    };

    const iconSizes = {
        sm: '16px',
        md: '20px',
        lg: '28px',
    };

    return (
        <div className={`flex items-center ${sizeClasses[size]}`}>
            <div className="relative">
                <span
                    className="material-symbols-outlined text-orange-500"
                    style={{
                        fontSize: iconSizes[size],
                        fontVariationSettings: "'FILL' 1"
                    }}
                >
                    local_fire_department
                </span>
                {/* Streak freeze indicator for premium */}
                {isPremium && !streak.streakFreezeUsed && (
                    <span
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"
                        title="Streak Freeze tersedia"
                    />
                )}
            </div>
            <span className="font-bold text-orange-600">{currentStreak}</span>
            {showLabel && (
                <span className="text-text-secondary text-sm">hari</span>
            )}
        </div>
    );
}

export default StreakDisplay;
