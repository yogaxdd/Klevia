import { NavLink, useLocation } from 'react-router-dom';

// Bottom Navigation Component
function BottomNav() {
    const location = useLocation();

    const navItems = [
        { path: '/home', icon: 'home', label: 'Beranda' },
        { path: '/levels', icon: 'book_2', label: 'Pelajaran' },
        { path: '/profile', icon: 'person', label: 'Profil' },
        { path: '/settings', icon: 'settings', label: 'Pengaturan' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface border-t border-border px-6 pb-6 pt-3 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-end max-w-md mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${isActive(item.path)
                            ? 'text-text-main'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className={`
              flex h-7 items-center justify-center rounded-full px-4 py-1 transition-colors
              ${isActive(item.path) ? 'bg-primary/20' : ''}
            `}>
                            <span
                                className={`material-symbols-outlined text-[24px] ${isActive(item.path) ? 'text-primary' : ''
                                    }`}
                                style={{
                                    fontVariationSettings: isActive(item.path) ? "'FILL' 1" : "'FILL' 0"
                                }}
                            >
                                {item.icon}
                            </span>
                        </div>
                        <span className={`text-[11px] ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default BottomNav;
