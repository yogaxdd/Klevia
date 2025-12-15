import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../firebase/AuthContext';
import Card from '../components/Card';

function LeaderboardPage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab, currentUser]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching leaderboard from Firestore...');
            const usersRef = collection(db, 'users');
            const q = query(usersRef, orderBy('xp', 'desc'), limit(100));
            const snapshot = await getDocs(q);

            console.log('Got', snapshot.size, 'users');

            const users = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log('User:', data.displayName, 'XP:', data.xp);
                users.push({
                    id: doc.id,
                    displayName: data.displayName || data.name || 'Pelajar',
                    xp: data.xp || 0,
                    level: data.level || 1,
                    photoURL: data.photoURL || null,
                    kelas: data.kelas || null,
                    lessonsCompleted: data.lessonsCompleted || 0,
                });
            });

            setLeaderboard(users);

            // Find current user rank
            if (currentUser) {
                const userIndex = users.findIndex(u => u.id === currentUser.uid);
                if (userIndex !== -1) {
                    setCurrentUserRank(userIndex + 1);
                } else {
                    setCurrentUserRank('>100');
                }
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Avatar component with error handling
    const Avatar = ({ photoURL, name, size = 'md', className = '' }) => {
        const [imgError, setImgError] = useState(false);
        const sizeClasses = {
            sm: 'w-10 h-10 text-sm',
            md: 'w-16 h-16 text-lg',
            lg: 'w-20 h-20 text-xl',
        };

        if (!photoURL || imgError) {
            return (
                <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold ${className}`}>
                    {getInitials(name)}
                </div>
            );
        }

        return (
            <img
                src={photoURL}
                alt={name}
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
            />
        );
    };

    return (
        <div className="min-h-screen bg-background pb-28">
            <div className="max-w-md mx-auto">
                {/* Header - Green Theme */}
                <header className="bg-gradient-to-br from-primary via-emerald-500 to-teal-500 px-6 pt-10 pb-8 rounded-b-[2rem]">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
                            <p className="text-white/80 text-sm">Top 100 Pelajar Terbaik</p>
                        </div>
                        <div className="ml-auto">
                            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                emoji_events
                            </span>
                        </div>
                    </div>

                    {/* Tab Filters */}
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'Semua' },
                            { id: 'weekly', label: 'Minggu Ini' },
                            { id: 'monthly', label: 'Bulan Ini' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white text-primary'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Error State */}
                {error && (
                    <div className="px-4 py-4">
                        <Card className="bg-red-50 border border-red-200">
                            <p className="text-red-600 text-sm">Error: {error}</p>
                            <button
                                onClick={fetchLeaderboard}
                                className="mt-2 text-sm text-primary font-medium"
                            >
                                Coba Lagi
                            </button>
                        </Card>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <>
                        {/* Podium - Top 3 */}
                        {leaderboard.length >= 3 && (
                            <div className="px-4 -mt-4">
                                <div className="flex items-end justify-center gap-3 mb-6">
                                    {/* 2nd Place */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-2">
                                            <div className="border-4 border-white shadow-lg overflow-hidden rounded-full">
                                                <Avatar photoURL={leaderboard[1]?.photoURL} name={leaderboard[1]?.displayName} size="md" />
                                            </div>
                                            <span className="absolute -bottom-1 -right-1 text-2xl">🥈</span>
                                        </div>
                                        <p className="font-bold text-sm text-text-main text-center truncate w-20">{leaderboard[1]?.displayName}</p>
                                        <p className="text-xs text-text-secondary">Kelas {leaderboard[1]?.kelas || '-'}</p>
                                        <p className="text-xs text-primary font-bold">{leaderboard[1]?.xp?.toLocaleString()} XP</p>
                                        <div className="w-16 h-16 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-2 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-600">2</span>
                                        </div>
                                    </div>

                                    {/* 1st Place */}
                                    <div className="flex flex-col items-center -mb-4">
                                        <div className="relative mb-2">
                                            <div className="border-4 border-white shadow-xl overflow-hidden rounded-full">
                                                <Avatar photoURL={leaderboard[0]?.photoURL} name={leaderboard[0]?.displayName} size="lg" />
                                            </div>
                                            <span className="absolute -bottom-1 -right-1 text-3xl">🥇</span>
                                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">👑</span>
                                        </div>
                                        <p className="font-bold text-sm text-text-main text-center truncate w-24">{leaderboard[0]?.displayName}</p>
                                        <p className="text-xs text-text-secondary">Kelas {leaderboard[0]?.kelas || '-'}</p>
                                        <p className="text-xs text-primary font-bold">{leaderboard[0]?.xp?.toLocaleString()} XP</p>
                                        <div className="w-20 h-24 bg-gradient-to-t from-amber-400 to-yellow-300 rounded-t-lg mt-2 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-amber-700">1</span>
                                        </div>
                                    </div>

                                    {/* 3rd Place */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-2">
                                            <div className="border-4 border-white shadow-lg overflow-hidden rounded-full">
                                                <Avatar photoURL={leaderboard[2]?.photoURL} name={leaderboard[2]?.displayName} size="md" />
                                            </div>
                                            <span className="absolute -bottom-1 -right-1 text-2xl">🥉</span>
                                        </div>
                                        <p className="font-bold text-sm text-text-main text-center truncate w-20">{leaderboard[2]?.displayName}</p>
                                        <p className="text-xs text-text-secondary">Kelas {leaderboard[2]?.kelas || '-'}</p>
                                        <p className="text-xs text-primary font-bold">{leaderboard[2]?.xp?.toLocaleString()} XP</p>
                                        <div className="w-16 h-12 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg mt-2 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-orange-700">3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rankings List (4-100) */}
                        <div className="px-4">
                            <Card className="divide-y divide-gray-100">
                                {leaderboard.slice(3).map((user, index) => {
                                    const rank = index + 4;
                                    const isCurrentUser = currentUser && user.id === currentUser.uid;

                                    return (
                                        <div
                                            key={user.id}
                                            className={`flex items-center gap-3 py-3 px-2 ${isCurrentUser ? 'bg-primary/10 rounded-lg -mx-2 px-4' : ''}`}
                                        >
                                            {/* Rank */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCurrentUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {rank}
                                            </div>

                                            {/* Avatar */}
                                            <Avatar photoURL={user.photoURL} name={user.displayName} size="sm" />

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-primary' : 'text-text-main'}`}>
                                                    {user.displayName} {isCurrentUser && '(Kamu)'}
                                                </p>
                                                <p className="text-xs text-text-secondary">
                                                    Kelas {user.kelas || '-'} • Level {user.level}
                                                </p>
                                            </div>

                                            {/* XP */}
                                            <div className="text-right">
                                                <p className={`font-bold text-sm ${isCurrentUser ? 'text-primary' : 'text-text-main'}`}>
                                                    {user.xp?.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-text-secondary">XP</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Card>
                        </div>

                        {/* Empty State */}
                        {leaderboard.length === 0 && !error && (
                            <div className="text-center py-20 px-6">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                                    leaderboard
                                </span>
                                <h3 className="text-lg font-bold text-text-main mb-2">Belum Ada Data</h3>
                                <p className="text-text-secondary">Leaderboard akan muncul setelah ada pengguna yang belajar.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Current User Rank - Sticky Footer */}
                {currentUser && userData && currentUserRank && (
                    <div className="fixed bottom-4 left-0 lg:left-64 right-0 px-4 z-40">
                        <div className="max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto">
                            <Card className="bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                        {currentUser.photoURL ? (
                                            <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <span className="font-bold">{getInitials(userData.displayName)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">Peringkat Kamu</p>
                                        <p className="text-white/80 text-sm">Kelas {userData.kelas || '-'} • Level {userData.level}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">#{currentUserRank}</p>
                                        <p className="text-white/80 text-sm">{(userData.xp || 0).toLocaleString()} XP</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LeaderboardPage;
