import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { subscribeToRoom, leaveRoom } from '../services/battleService';
import Card from '../components/Card';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function BattleResultPage() {
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const { currentUser } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const { width, height } = useWindowSize();

    const isHost = room?.hostId === currentUser?.uid;
    const myScore = isHost ? room?.hostScore : room?.guestScore;
    const opponentScore = isHost ? room?.guestScore : room?.hostScore;
    const myName = isHost ? room?.hostName : room?.guestName;
    const opponentName = isHost ? room?.guestName : room?.hostName;
    const opponentPhoto = isHost ? room?.guestPhoto : room?.hostPhoto;
    const myPhoto = isHost ? room?.hostPhoto : room?.guestPhoto;

    const isWinner = myScore > opponentScore;
    const isDraw = myScore === opponentScore;

    useEffect(() => {
        if (!roomCode) return;

        const unsubscribe = subscribeToRoom(roomCode, (roomData) => {
            // Only update room if we get valid data
            // Once we have data, keep it even if room gets deleted (so user can still see results)
            if (roomData) {
                setRoom(roomData);
            }
            setLoading(false);

            // Don't auto-navigate away - let user click "Main Lagi" or "Kembali"
            // This allows them to screenshot results before leaving
        });

        return () => unsubscribe();
    }, [roomCode, navigate]);

    const handlePlayAgain = () => {
        localStorage.removeItem('klevia_active_battle');
        leaveRoom(roomCode, currentUser.uid);
        navigate('/battle');
    };

    const handleHome = () => {
        localStorage.removeItem('klevia_active_battle');
        leaveRoom(roomCode, currentUser.uid);
        navigate('/home');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex flex-col pb-20">
            {/* Confetti for winner */}
            {isWinner && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

            {/* Result Header */}
            <div className={`text-center py-12 ${isWinner ? 'bg-gradient-to-b from-emerald-400 to-emerald-500' :
                isDraw ? 'bg-gradient-to-b from-blue-400 to-blue-500' :
                    'bg-gradient-to-b from-gray-400 to-gray-500'
                } text-white rounded-b-3xl`}>
                <span className="material-symbols-outlined text-6xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isWinner ? 'emoji_events' : isDraw ? 'handshake' : 'sentiment_dissatisfied'}
                </span>
                <h1 className="text-3xl font-black">
                    {isWinner ? 'Kamu Menang! 🎉' : isDraw ? 'Seri!' : 'Kalah...'}
                </h1>
                <p className="text-white/80 mt-1">
                    {room?.settings?.kelasName} • {room?.questions?.length} soal
                </p>
            </div>

            {/* Score Comparison */}
            <div className="px-4 -mt-8">
                <Card className="shadow-xl">
                    <div className="flex items-center justify-between">
                        {/* My Score */}
                        <div className="text-center flex-1">
                            <div className={`w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden ${isWinner ? 'ring-4 ring-emerald-400 bg-emerald-100' : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                {myPhoto ? (
                                    <img src={myPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="text-2xl font-bold text-primary">{myName?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <p className="font-bold text-text-main">{myName}</p>
                            <p className={`text-4xl font-black mt-2 ${isWinner ? 'text-primary' : 'text-text-main'}`}>
                                {myScore}
                            </p>
                            {isWinner && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                    🏆 Pemenang
                                </span>
                            )}
                        </div>

                        {/* VS */}
                        <div className="px-4">
                            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                                <span className="text-white font-black">VS</span>
                            </div>
                        </div>

                        {/* Opponent Score */}
                        <div className="text-center flex-1">
                            <div className={`w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden ${!isWinner && !isDraw ? 'ring-4 ring-emerald-400 bg-emerald-100' : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                {opponentPhoto ? (
                                    <img src={opponentPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="text-2xl font-bold text-blue-500">{opponentName?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <p className="font-bold text-text-main">{opponentName}</p>
                            <p className={`text-4xl font-black mt-2 ${!isWinner && !isDraw ? 'text-primary' : 'text-text-main'}`}>
                                {opponentScore}
                            </p>
                            {!isWinner && !isDraw && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                    🏆 Pemenang
                                </span>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Stats */}
                <Card className="mt-4">
                    <h3 className="font-bold text-text-main mb-3">Statistik</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <p className="text-2xl font-bold text-green-600">{myScore}</p>
                            <p className="text-xs text-text-secondary">Jawaban Benar</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <p className="text-2xl font-bold text-red-600">{(room?.questions?.length || 0) - myScore}</p>
                            <p className="text-xs text-text-secondary">Jawaban Salah</p>
                        </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                        <p className="text-lg font-bold text-blue-600">
                            {Math.round((myScore / (room?.questions?.length || 1)) * 100)}%
                        </p>
                        <p className="text-xs text-text-secondary">Akurasi</p>
                    </div>
                </Card>

                {/* Actions */}
                <div className="mt-6 space-y-3 pb-8">
                    <Button variant="primary" size="lg" fullWidth onClick={handlePlayAgain}>
                        🎮 Main Lagi
                    </Button>
                    <Button variant="secondary" size="lg" fullWidth onClick={handleHome}>
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default BattleResultPage;
