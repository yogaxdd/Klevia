// Heart Display Component (Lives indicator)
import { useApp } from '../context/AppContext';

function HeartDisplay({ hearts = 5, maxHearts = 5 }) {
    const { user } = useApp();
    const isPremium = user.isPremium && new Date(user.premiumExpiry) > new Date();

    return (
        <div className="flex items-center gap-1 text-red-500 font-bold text-lg">
            <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
                favorite
            </span>
            <span className={isPremium ? 'text-2xl' : ''}>{isPremium ? '∞' : hearts}</span>
        </div>
    );
}

export default HeartDisplay;
