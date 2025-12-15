import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { subscribeToRoom, submitAnswer, finishQuiz, endGame } from '../services/battleService';
import Card from '../components/Card';
import Button from '../components/Button';

function BattleGamePage() {
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const { currentUser } = useAuth();
    const [room, setRoom] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [myAnswers, setMyAnswers] = useState([]);

    const isHost = room?.hostId === currentUser?.uid;
    const settings = room?.settings;
    const questions = room?.questions || [];
    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;

    // Subscribe to room
    useEffect(() => {
        if (!roomCode || !currentUser) return;

        const unsubscribe = subscribeToRoom(roomCode, (roomData) => {
            if (!roomData) {
                navigate('/battle');
                return;
            }

            // Security check - user must be host or guest
            const isParticipant = roomData.hostId === currentUser.uid || roomData.guestId === currentUser.uid;
            if (!isParticipant) {
                console.warn('Unauthorized access attempt');
                navigate('/battle');
                return;
            }

            setRoom(roomData);

            // Restore progress on reconnect - check if we have saved answers
            const amHost = roomData.hostId === currentUser.uid;
            const savedAnswers = amHost ? roomData.hostAnswers : roomData.guestAnswers;
            
            if (savedAnswers && savedAnswers.length > 0 && myAnswers.length === 0) {
                // Reconnecting - restore progress
                setMyAnswers(savedAnswers);
                const nextIndex = savedAnswers.length;
                const totalQ = roomData.questions?.length || 0;
                
                if (nextIndex < totalQ) {
                    setCurrentIndex(nextIndex);
                    setAnswered(false);
                    setSelectedAnswer(null);
                    console.log(`🎮 Reconnected! Resuming at question ${nextIndex + 1}/${totalQ}`);
                }
            }

            // Check if opponent disconnected (left the game)
            const opponentLeft = amHost ? !roomData.guestId : !roomData.hostId;

            if (opponentLeft && roomData.status === 'playing') {
                // Opponent disconnected - end game (we win by default)
                endGame(roomCode);
            }

            if (roomData.status === 'finished') {
                navigate(`/battle/result/${roomCode}`);
            }
        });

        return () => unsubscribe();
    }, [roomCode, navigate, currentUser]);

    // Timer for timed mode
    useEffect(() => {
        if (!settings || settings.mode !== 'timed' || !settings.timePerQuestion) return;
        if (answered) return;

        setTimeLeft(settings.timePerQuestion);

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up - auto submit wrong
                    handleSubmit(null, true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, answered, settings]);

    const handleSelect = (index) => {
        if (answered) return;
        setSelectedAnswer(index);
    };

    const handleSubmit = useCallback(async (forcedAnswer = null, timedOut = false) => {
        if (answered) return;

        const answer = timedOut ? -1 : (forcedAnswer ?? selectedAnswer);
        const isCorrect = answer === currentQuestion?.correctAnswer;

        setAnswered(true);
        setMyAnswers(prev => [...prev, { index: currentIndex, answer, isCorrect }]);

        try {
            await submitAnswer(roomCode, currentUser.uid, currentIndex, answer, isCorrect);
        } catch (err) {
            console.error(err);
        }

        // Move to next after delay
        setTimeout(() => {
            if (currentIndex < totalQuestions - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setAnswered(false);
            } else {
                // Finished all questions
                finishQuiz(roomCode, currentUser.uid);
            }
        }, 1500);
    }, [answered, selectedAnswer, currentQuestion, currentIndex, totalQuestions, roomCode, currentUser]);

    const labels = ['A', 'B', 'C', 'D'];

    // Scores and player info
    const myScore = isHost ? room?.hostScore : room?.guestScore;
    const opponentScore = isHost ? room?.guestScore : room?.hostScore;
    const myName = isHost ? room?.hostName : room?.guestName;
    const opponentName = isHost ? room?.guestName : room?.hostName;
    const myPhoto = isHost ? room?.hostPhoto : room?.guestPhoto;
    const opponentPhoto = isHost ? room?.guestPhoto : room?.hostPhoto;
    const myFinished = isHost ? room?.hostFinished : room?.guestFinished;
    const opponentFinished = isHost ? room?.guestFinished : room?.hostFinished;

    if (!room || !currentQuestion) {
        // If room exists but no questions, show error
        if (room && (!room.questions || room.questions.length === 0)) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h2 className="text-xl font-bold text-text-main mb-2">Tidak Ada Soal</h2>
                    <p className="text-text-secondary mb-4">Mapel ini belum memiliki soal</p>
                    <Button variant="primary" onClick={() => navigate('/battle')}>Kembali</Button>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col pb-32">
            {/* Header with scores */}
            <div className="bg-gradient-to-r from-primary to-emerald-500 text-white px-4 py-3">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {/* My score */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                {myPhoto ? (
                                    <img src={myPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="text-white font-bold">{myName?.[0]?.toUpperCase() || 'Y'}</span>
                                )}
                            </div>
                            <span className="absolute -bottom-1 -right-1 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                                {myScore || 0}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-white/70">Kamu</p>
                            <p className="font-bold text-sm">{myFinished ? '✓ Selesai' : 'Bermain'}</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="text-center">
                        <span className="text-3xl font-black">{currentIndex + 1}</span>
                        <span className="text-white/70">/{totalQuestions}</span>
                        {timeLeft !== null && settings?.mode === 'timed' && (
                            <div className={`text-xs mt-1 ${timeLeft <= 5 ? 'text-red-300 font-bold animate-pulse' : 'text-white/70'}`}>
                                ⏱ {timeLeft}s
                            </div>
                        )}
                    </div>

                    {/* Opponent score */}
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="text-xs text-white/70">{opponentName}</p>
                            <p className="font-bold text-sm">{opponentFinished ? '✓ Selesai' : 'Bermain'}</p>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center overflow-hidden">
                                {opponentPhoto ? (
                                    <img src={opponentPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <span className="text-white font-bold">{opponentName?.[0]?.toUpperCase() || 'O'}</span>
                                )}
                            </div>
                            <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                                {opponentScore || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timer bar */}
            {settings?.mode === 'timed' && timeLeft !== null && (
                <div className="h-1 bg-gray-200 dark:bg-gray-700">
                    <div
                        className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${(timeLeft / settings.timePerQuestion) * 100}%` }}
                    />
                </div>
            )}

            {/* Question */}
            <div className="flex-1 p-4 overflow-y-auto">
                <Card className="mb-4 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-lg font-medium text-text-main leading-relaxed">
                        {currentQuestion.question}
                    </p>
                </Card>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options?.map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrectAnswer = idx === currentQuestion.correctAnswer;

                        let optionStyle = 'border-gray-200 dark:border-gray-700 bg-surface';
                        if (answered) {
                            if (isCorrectAnswer) {
                                optionStyle = 'border-primary bg-primary/10 ring-2 ring-primary';
                            } else if (isSelected && !isCorrectAnswer) {
                                optionStyle = 'border-red-400 bg-red-50 dark:bg-red-900/20';
                            }
                        } else if (isSelected) {
                            optionStyle = 'border-primary bg-primary/5 ring-2 ring-primary';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                disabled={answered}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionStyle}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${answered && isCorrectAnswer
                                        ? 'bg-primary text-white'
                                        : isSelected
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-gray-100 dark:bg-gray-700 text-text-secondary'
                                        }`}>
                                        {labels[idx]}
                                    </div>
                                    <span className="text-text-main flex-1">{option}</span>
                                    {answered && isCorrectAnswer && (
                                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Submit button - fixed at bottom */}
            {!answered && (
                <div className="fixed bottom-4 left-4 right-4 lg:bottom-4 lg:left-[calc(16rem+1rem)] lg:right-4 z-40">
                    <div className="max-w-2xl mx-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => handleSubmit()}
                            disabled={selectedAnswer === null}
                        >
                            JAWAB
                        </Button>
                    </div>
                </div>
            )}

            {/* Answered feedback - fixed at bottom same as JAWAB button */}
            {answered && (
                <div className="fixed bottom-4 left-4 right-4 lg:bottom-4 lg:left-[calc(16rem+1rem)] lg:right-4 z-40">
                    <div className="max-w-2xl mx-auto">
                        <div className={`p-4 rounded-2xl text-center ${selectedAnswer === currentQuestion.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                            }`}>
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {selectedAnswer === currentQuestion.correctAnswer ? 'check_circle' : 'cancel'}
                            </span>
                            <p className="font-bold">
                                {selectedAnswer === currentQuestion.correctAnswer ? 'Benar!' : 'Salah!'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BattleGamePage;
