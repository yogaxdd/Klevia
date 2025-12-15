import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { createRoom, joinRoom, getAvailableClasses, subscribeToRoom, cleanupStaleRooms } from '../services/battleService';
import Card from '../components/Card';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';

function BattleLobbyPage() {
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    const [mode, setMode] = useState('menu'); // menu, create, join
    const [joinCode, setJoinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeRoom, setActiveRoom] = useState(null);

    // Room settings
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('all'); // 'all' or specific subject code
    const [questionCount, setQuestionCount] = useState(10);
    const [timePerQuestion, setTimePerQuestion] = useState(15);
    const [gameMode, setGameMode] = useState('timed'); // timed or race

    const classes = getAvailableClasses();

    // Subject options based on class level
    const getSubjects = (kelasId) => {
        if (!kelasId) return [];
        if (kelasId <= 9) {
            // SMP subjects
            return [
                { code: 'all', name: 'Semua Mapel', icon: '📚' },
                { code: 'matematika', name: 'Matematika', icon: '🔢' },
                { code: 'ipa', name: 'IPA', icon: '🔬' },
                { code: 'bahasa', name: 'B. Indonesia', icon: '📖' },
                { code: 'english', name: 'B. Inggris', icon: '🔤' },
            ];
        } else {
            // SMA subjects
            return [
                { code: 'all', name: 'Semua Mapel', icon: '📚' },
                { code: 'matematika', name: 'Matematika', icon: '🔢' },
                { code: 'biologi', name: 'Biologi', icon: '🧬' },
                { code: 'kimia', name: 'Kimia', icon: '⚗️' },
                { code: 'fisika', name: 'Fisika', icon: '⚡' },
                { code: 'bahasa', name: 'B. Indonesia', icon: '📖' },
                { code: 'english', name: 'B. Inggris', icon: '🔤' },
                { code: 'ekonomi', name: 'Ekonomi', icon: '💰' },
                { code: 'sosiologi', name: 'Sosiologi', icon: '👥' },
                { code: 'geografi', name: 'Geografi', icon: '🌍' },
                { code: 'sejarah', name: 'Sejarah', icon: '📜' },
            ];
        }
    };

    // Check for active battle room on mount
    useEffect(() => {
        // Cleanup stale rooms whenever user visits battle lobby
        cleanupStaleRooms();

        const savedRoom = localStorage.getItem('klevia_active_battle');
        if (savedRoom && currentUser) {
            const { roomCode, status } = JSON.parse(savedRoom);
            // Verify room still exists and is active
            const unsubscribe = subscribeToRoom(roomCode, (roomData) => {
                if (roomData && (roomData.status === 'waiting' || roomData.status === 'playing')) {
                    // Check if user is part of this room
                    if (roomData.hostId === currentUser.uid || roomData.guestId === currentUser.uid) {
                        setActiveRoom({ roomCode, status: roomData.status });
                    } else {
                        localStorage.removeItem('klevia_active_battle');
                    }
                } else {
                    localStorage.removeItem('klevia_active_battle');
                }
                unsubscribe();
            });
        }
    }, [currentUser]);

    const handleCreateRoom = async () => {
        if (!selectedKelas) {
            setError('Pilih kelas dulu!');
            return;
        }

        // Check if already in a room
        if (activeRoom) {
            const confirmLeave = window.confirm(
                `Kamu masih dalam match di room ${activeRoom.roomCode}.\n\nKeluar dari match sebelumnya dan buat room baru?`
            );
            if (!confirmLeave) return;
            // Leave the old room
            localStorage.removeItem('klevia_active_battle');
        }

        setLoading(true);
        setError('');

        try {
            const hostData = {
                uid: currentUser.uid,
                name: userData?.displayName || 'Player',
                photoURL: currentUser.photoURL
            };

            const settings = {
                kelas: selectedKelas.id,
                kelasName: selectedKelas.name,
                subject: selectedSubject,
                subjectName: getSubjects(selectedKelas.id).find(s => s.code === selectedSubject)?.name || 'Semua Mapel',
                questionCount,
                timePerQuestion: gameMode === 'timed' ? timePerQuestion : 0,
                mode: gameMode
            };

            const { roomCode } = await createRoom(hostData, settings);
            // Save active room for reconnect
            localStorage.setItem('klevia_active_battle', JSON.stringify({ roomCode, status: 'waiting' }));
            navigate(`/battle/waiting/${roomCode}`);
        } catch (err) {
            console.error(err);
            setError('Gagal membuat room');
        }
        setLoading(false);
    };

    const handleJoinRoom = async () => {
        if (joinCode.length !== 6) {
            setError('Kode room harus 6 karakter');
            return;
        }

        // Check if already in a room
        if (activeRoom) {
            const confirmLeave = window.confirm(
                `Kamu masih dalam match di room ${activeRoom.roomCode}.\n\nKeluar dari match sebelumnya dan join room baru?`
            );
            if (!confirmLeave) return;
            // Leave the old room
            localStorage.removeItem('klevia_active_battle');
        }

        setLoading(true);
        setError('');

        try {
            const guestData = {
                uid: currentUser.uid,
                name: userData?.displayName || 'Player',
                photoURL: currentUser.photoURL
            };

            await joinRoom(joinCode.toUpperCase(), guestData);
            // Save active room for reconnect
            localStorage.setItem('klevia_active_battle', JSON.stringify({ roomCode: joinCode.toUpperCase(), status: 'waiting' }));
            navigate(`/battle/waiting/${joinCode.toUpperCase()}`);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Gagal join room');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-emerald-600 text-white px-6 py-8 pb-12 rounded-b-3xl">
                <button
                    onClick={() => mode === 'menu' ? navigate(-1) : setMode('menu')}
                    className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>Kembali</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        swords
                    </span>
                    <div>
                        <h1 className="text-2xl font-bold">Quiz Battle</h1>
                        <p className="text-white/80 text-sm">Tantang temanmu 1v1!</p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-6">
                {/* Reconnect Banner */}
                {activeRoom && (
                    <Card className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-600 text-xl">sync</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-text-main">Battle Aktif</h3>
                                <p className="text-sm text-text-secondary">Room: {activeRoom.roomCode}</p>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    if (activeRoom.status === 'playing') {
                                        navigate(`/battle/game/${activeRoom.roomCode}`);
                                    } else {
                                        navigate(`/battle/waiting/${activeRoom.roomCode}`);
                                    }
                                }}
                            >
                                Lanjut
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Main Menu */}
                {mode === 'menu' && (
                    <div className="space-y-4">
                        <Card
                            className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
                            onClick={() => setMode('create')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-2xl">add_circle</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-main text-lg">Buat Room</h3>
                                    <p className="text-text-secondary text-sm">Buat room dan bagikan kode</p>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                            </div>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
                            onClick={() => setMode('join')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-2xl">login</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-main text-lg">Gabung Room</h3>
                                    <p className="text-text-secondary text-sm">Masukkan kode dari teman</p>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Create Room */}
                {mode === 'create' && (
                    <div className="space-y-4">
                        {/* Class Selection */}
                        <Card>
                            <h3 className="font-bold text-text-main mb-4">Pilih Kelas</h3>

                            {/* SMP */}
                            <p className="text-xs text-text-secondary mb-2 font-semibold">SMP</p>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {classes.filter(c => c.level === 'SMP').map(kelas => (
                                    <button
                                        key={kelas.id}
                                        onClick={() => setSelectedKelas(kelas)}
                                        className={`p-3 rounded-xl border-2 transition-all ${selectedKelas?.id === kelas.id
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-1 shadow-md">
                                            <span className="text-white font-bold">{kelas.id}</span>
                                        </div>
                                        <p className="text-xs font-medium text-text-main text-center">{kelas.name}</p>
                                    </button>
                                ))}
                            </div>

                            {/* SMA */}
                            <p className="text-xs text-text-secondary mb-2 font-semibold">SMA</p>
                            <div className="grid grid-cols-3 gap-2">
                                {classes.filter(c => c.level === 'SMA').map(kelas => (
                                    <button
                                        key={kelas.id}
                                        onClick={() => setSelectedKelas(kelas)}
                                        className={`p-3 rounded-xl border-2 transition-all ${selectedKelas?.id === kelas.id
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-1 shadow-md">
                                            <span className="text-white font-bold text-sm">{kelas.id}</span>
                                        </div>
                                        <p className="text-xs font-medium text-text-main text-center">{kelas.name}</p>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Subject Selection - only show if class selected */}
                        {selectedKelas && (
                            <Card>
                                <h3 className="font-bold text-text-main mb-4">Pilih Mata Pelajaran</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {getSubjects(selectedKelas.id).map(subject => (
                                        <button
                                            key={subject.code}
                                            onClick={() => setSelectedSubject(subject.code)}
                                            className={`p-2 rounded-xl border-2 transition-all ${selectedSubject === subject.code
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{subject.icon}</div>
                                            <p className="text-xs font-medium text-text-main text-center truncate">{subject.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card>
                            <h3 className="font-bold text-text-main mb-4">Jumlah Soal</h3>
                            <div className="flex gap-2">
                                {[5, 10, 15, 20].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setQuestionCount(num)}
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${questionCount === num
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-text-main hover:bg-gray-200'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-bold text-text-main mb-4">Mode Permainan</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setGameMode('timed')}
                                    className={`p-4 rounded-xl border-2 transition-all ${gameMode === 'timed'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-2xl text-primary mb-2">timer</span>
                                    <p className="font-medium text-text-main">Waktu</p>
                                    <p className="text-xs text-text-secondary">Ada batas waktu per soal</p>
                                </button>
                                <button
                                    onClick={() => setGameMode('race')}
                                    className={`p-4 rounded-xl border-2 transition-all ${gameMode === 'race'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-2xl text-amber-500 mb-2">bolt</span>
                                    <p className="font-medium text-text-main">Balapan</p>
                                    <p className="text-xs text-text-secondary">Siapa selesai duluan</p>
                                </button>
                            </div>
                        </Card>

                        {gameMode === 'timed' && (
                            <Card>
                                <h3 className="font-bold text-text-main mb-4">Waktu per Soal</h3>
                                <div className="flex gap-2">
                                    {[10, 15, 20, 30].map(sec => (
                                        <button
                                            key={sec}
                                            onClick={() => setTimePerQuestion(sec)}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${timePerQuestion === sec
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-text-main hover:bg-gray-200'
                                                }`}
                                        >
                                            {sec}s
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleCreateRoom}
                            disabled={loading || !selectedKelas}
                        >
                            {loading ? 'Membuat...' : 'Buat Room'}
                        </Button>
                    </div>
                )}

                {/* Join Room */}
                {mode === 'join' && (
                    <div className="space-y-4">
                        <Card>
                            <h3 className="font-bold text-text-main mb-4">Masukkan Kode Room</h3>
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                                placeholder="XXXXXX"
                                className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-2 border-border rounded-xl bg-surface text-text-main focus:border-primary focus:outline-none"
                                maxLength={6}
                            />
                            <p className="text-text-secondary text-sm text-center mt-2">
                                Minta kode dari teman yang membuat room
                            </p>
                        </Card>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleJoinRoom}
                            disabled={loading || joinCode.length !== 6}
                        >
                            {loading ? 'Mencari...' : 'Gabung'}
                        </Button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}

export default BattleLobbyPage;
