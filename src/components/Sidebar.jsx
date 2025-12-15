import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../firebase/AuthContext';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useApp();
    const { currentUser } = useAuth();

    // Hide sidebar if user is not logged in
    if (!currentUser) {
        return null;
    }

    const navItems = [
        { path: '/home', icon: 'home', label: 'Beranda' },
        { path: '/levels', icon: 'book_2', label: 'Pelajaran' },
        { path: '/profile', icon: 'person', label: 'Profil' },
        { path: '/settings', icon: 'settings', label: 'Pengaturan' },
    ];

    const quickActions = [
        { path: '/daily-quiz', icon: 'quiz', label: 'Kuis Harian', color: 'blue' },
        { path: '/battle', icon: 'swords', label: 'Quiz Battle', color: 'red', filled: true },
        { path: '/practice', icon: 'fitness_center', label: 'Mode Latihan', color: 'green', filled: true },
        { path: '/srs', icon: 'psychology', label: 'SRS Review', color: 'teal' },
        { path: '/leaderboard', icon: 'emoji_events', label: 'Leaderboard', color: 'amber', filled: true },
        { path: '/statistics', icon: 'bar_chart', label: 'Statistik', color: 'purple' },
    ];

    const isActive = (path) => location.pathname === path;

    const colorClasses = {
        blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600',
        red: 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600',
        green: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600',
        teal: 'hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600',
        amber: 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600',
        purple: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600',
    };

    return (
        <aside className="hidden lg:flex flex-col h-screen w-64 bg-surface border-r border-border fixed left-0 top-0 z-40">
            {/* Logo Header */}
            <div className="px-5 py-6">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-3 group"
                >
                    <img
                        src="/Assets/logo.jpg"
                        alt="KLEVIA"
                        className="w-11 h-11 rounded-xl object-cover shadow-sm"
                    />
                    <div className="text-left">
                        <h1 className="text-lg font-black text-text-main tracking-tight group-hover:text-primary transition-colors">KLEVIA</h1>
                        <p className="text-[11px] text-text-secondary -mt-0.5 tracking-wide">Belajar Jadi Mudah</p>
                    </div>
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <button
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.path)
                                    ? 'bg-primary text-white font-medium shadow-sm'
                                    : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-main'
                                    }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    style={{ fontVariationSettings: isActive(item.path) ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Quick Actions */}
                <div className="mt-6 pt-5 border-t border-border">
                    <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest px-3 mb-2">
                        Aksi Cepat
                    </p>
                    <ul className="space-y-1">
                        {quickActions.map((item) => (
                            <li key={item.path}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary transition-all ${colorClasses[item.color]}`}
                                >
                                    <span
                                        className="material-symbols-outlined text-[20px]"
                                        style={{ fontVariationSettings: item.filled ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* User Profile */}
            <div className="p-3 border-t border-border">
                <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-border">
                        {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-primary text-lg">person</span>
                        )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-text-main text-sm truncate">
                            {user.name || 'Pengguna'}
                        </p>
                        <p className="text-[11px] text-text-secondary">Level {user.level || 1} • {user.xp || 0} XP</p>
                    </div>
                    <span className="material-symbols-outlined text-text-secondary/50 text-lg group-hover:text-primary transition-colors">
                        chevron_right
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;

