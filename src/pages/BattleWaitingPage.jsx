import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { subscribeToRoom, setReady, startGame, leaveRoom } from '../services/battleService';
import soundService from '../services/soundService';
import Card from '../components/Card';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';

function BattleWaitingPage() {
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const { currentUser, userData } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [prevGuestReady, setPrevGuestReady] = useState(false);
    const [prevGuestId, setPrevGuestId] = useState(null);

    const isHost = room?.hostId === currentUser?.uid;
    const isGuest = room?.guestId === currentUser?.uid;
    const myReady = isHost ? room?.hostReady : room?.guestReady;
    const opponentReady = isHost ? room?.guestReady : room?.hostReady;
    const canStart = isHost && room?.guestId && room?.guestReady;

    useEffect(() => {
        if (!roomCode) return;

        const unsubscribe = subscribeToRoom(roomCode, (roomData) => {
            setRoom(roomData);
            setLoading(false);

            if (!roomData) {
                navigate('/battle');
                return;
            }

            // Track guest ID for comparison
            if (roomData.guestId && !prevGuestId) {
                setPrevGuestId(roomData.guestId);
            }

            // Play sound ONLY when guest becomes ready (not unready)
            if (roomData.guestReady && !prevGuestReady) {
                soundService.playReady();
                setPrevGuestReady(true);
            } else if (!roomData.guestReady && prevGuestReady) {
                // Guest cancelled ready
                setPrevGuestReady(false);
            }

            // Handle countdown - play battle start sound
            if (roomData.status === 'countdown') {
                setCountdown(3);
                soundService.playBattleStart();
            }

            // Navigate to game when playing
            if (roomData.status === 'playing') {
                navigate(`/battle/game/${roomCode}`);
            }
        });

        return () => unsubscribe();
    }, [roomCode, navigate]);

    // Countdown effect
    useEffect(() => {
        if (countdown === null) return;
        if (countdown === 0) return;

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const handleReady = async () => {
        try {
            await setReady(roomCode, currentUser.uid, !myReady);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStart = async () => {
        if (!canStart) return;
        setStarting(true);
        try {
            await startGame(roomCode, currentUser.uid);
        } catch (err) {
            console.error(err);
            setStarting(false);
        }
    };

    const handleLeave = async () => {
        try {
            await leaveRoom(roomCode, currentUser.uid);
            navigate('/battle');
        } catch (err) {
            console.error(err);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                <h2 className="text-xl font-bold text-text-main mb-2">Room Tidak Ditemukan</h2>
                <Button variant="primary" onClick={() => navigate('/battle')}>Kembali</Button>
            </div>
        );
    }

    // Countdown overlay
    if (countdown !== null && countdown > 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-9xl font-black text-white animate-pulse">{countdown}</span>
                    <p className="text-white/80 text-xl mt-4">Bersiap...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-emerald-600 text-white px-6 py-8 pb-16 rounded-b-3xl">
                <button onClick={handleLeave} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>Keluar</span>
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm">Kode Room</p>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-black tracking-widest">{roomCode}</h1>
                            <button onClick={copyCode} className="p-1 hover:bg-white/20 rounded">
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/80 text-sm">{room.settings?.kelasName}</p>
                        <p className="text-sm">{room.settings?.subjectName || 'Semua Mapel'}</p>
                        <p className="text-xs text-white/70">{room.settings?.questionCount} soal • {
                            room.settings?.mode === 'timed'
                                ? `${room.settings?.timePerQuestion}s/soal`
                                : 'Balapan'
                        }</p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-8">
                {/* Players */}
                <Card className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Host */}
                        <div className={`text-center p-4 rounded-xl ${room.hostReady ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                                {room.hostPhoto ? (
                                    <img src={room.hostPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="text-white font-bold text-xl">{room.hostName?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <p className="font-bold text-text-main truncate">{room.hostName}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${room.hostReady ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary'}`}>
                                {room.hostReady ? '✓ Ready' : 'Host'}
                            </span>
                        </div>

                        {/* Guest */}
                        <div className={`text-center p-4 rounded-xl ${room.guestReady ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            {room.guestId ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                                        {room.guestPhoto ? (
                                            <img src={room.guestPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <span className="text-white font-bold text-xl">{room.guestName?.[0]?.toUpperCase()}</span>
                                        )}
                                    </div>
                                    <p className="font-bold text-text-main truncate">{room.guestName}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${room.guestReady ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary'}`}>
                                        {room.guestReady ? '✓ Ready' : 'Waiting...'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
                                        <span className="material-symbols-outlined text-gray-400 text-3xl">person_add</span>
                                    </div>
                                    <p className="text-text-secondary">Menunggu...</p>
                                    <span className="text-xs text-text-secondary">Bagikan kode!</span>
                                </>
                            )}
                        </div>
                    </div>
                </Card>

                {/* VS */}
                <div className="flex items-center justify-center -my-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-lg">VS</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-3">
                    {isGuest && (
                        <Button
                            variant={myReady ? 'secondary' : 'primary'}
                            size="lg"
                            fullWidth
                            onClick={handleReady}
                        >
                            {myReady ? '✓ Sudah Ready' : 'Ready!'}
                        </Button>
                    )}

                    {isHost && (
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleStart}
                            disabled={!canStart || starting}
                        >
                            {starting ? 'Memulai...' : canStart ? '🎮 Mulai Battle!' : 'Tunggu Lawan Ready...'}
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={handleLeave}
                    >
                        Keluar Room
                    </Button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default BattleWaitingPage;
