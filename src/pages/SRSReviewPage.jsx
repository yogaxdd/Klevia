import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { getDueCards, reviewCard, getSRSStats, QUALITY } from '../services/srsService';
import Card from '../components/Card';
import Button from '../components/Button';
import BottomNav from '../components/BottomNav';

function SRSReviewPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [reviewed, setReviewed] = useState(0);
    const [sessionComplete, setSessionComplete] = useState(false);

    const currentCard = cards[currentIndex];

    useEffect(() => {
        loadCards();
    }, [currentUser]);

    const loadCards = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const [dueCards, srsStats] = await Promise.all([
                getDueCards(currentUser.uid, 20),
                getSRSStats(currentUser.uid)
            ]);
            setCards(dueCards);
            setStats(srsStats);
            if (dueCards.length === 0) {
                setSessionComplete(true);
            }
        } catch (error) {
            console.error('Error loading SRS cards:', error);
        }
        setLoading(false);
    };

    const handleSelectAnswer = (index) => {
        if (showAnswer) return;
        setSelectedAnswer(index);
    };

    const handleCheck = () => {
        if (selectedAnswer === null) return;
        const correct = selectedAnswer === currentCard.correctAnswer;
        setIsCorrect(correct);
        setShowAnswer(true);
    };

    const handleRate = async (quality) => {
        try {
            await reviewCard(currentUser.uid, currentCard.id, quality);
            setReviewed(prev => prev + 1);

            // Move to next card
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
                resetState();
            } else {
                setSessionComplete(true);
            }
        } catch (error) {
            console.error('Error reviewing card:', error);
        }
    };

    const resetState = () => {
        setShowAnswer(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const labels = ['A', 'B', 'C', 'D'];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Session complete or no cards
    if (sessionComplete || cards.length === 0) {
        return (
            <div className="min-h-screen bg-background pb-24">
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => navigate('/home')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold text-text-main">Spaced Repetition</h1>
                    </div>

                    {/* Stats Card */}
                    {stats && (
                        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-emerald-500/10">
                            <h2 className="text-lg font-bold text-text-main mb-4">Statistik SRS</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-surface rounded-xl">
                                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                                    <div className="text-xs text-text-secondary">Total Kartu</div>
                                </div>
                                <div className="text-center p-3 bg-surface rounded-xl">
                                    <div className="text-2xl font-bold text-amber-500">{stats.dueNow}</div>
                                    <div className="text-xs text-text-secondary">Perlu Review</div>
                                </div>
                                <div className="text-center p-3 bg-surface rounded-xl">
                                    <div className="text-2xl font-bold text-blue-500">{stats.learning}</div>
                                    <div className="text-xs text-text-secondary">Sedang Dipelajari</div>
                                </div>
                                <div className="text-center p-3 bg-surface rounded-xl">
                                    <div className="text-2xl font-bold text-green-500">{stats.mastered}</div>
                                    <div className="text-xs text-text-secondary">Sudah Hafal</div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Complete Message */}
                    <Card className="text-center py-8">
                        <span className="material-symbols-outlined text-6xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {reviewed > 0 ? 'celebration' : 'inbox'}
                        </span>
                        <h2 className="text-xl font-bold text-text-main mb-2">
                            {reviewed > 0 ? 'Sesi Selesai! 🎉' : 'Tidak Ada Kartu'}
                        </h2>
                        <p className="text-text-secondary mb-6">
                            {reviewed > 0
                                ? `Kamu sudah review ${reviewed} kartu. Kembali lagi nanti!`
                                : 'Belum ada soal yang perlu direview. Selesaikan lesson untuk menambah kartu!'
                            }
                        </p>
                        <Button variant="primary" onClick={() => navigate('/home')}>
                            Kembali ke Beranda
                        </Button>
                    </Card>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-background shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Progress */}
                <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm text-text-secondary font-medium">
                            {currentIndex + 1}/{cards.length}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                    </span>
                    <span className="text-sm font-bold">SRS</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Question Card */}
                <Card className="mb-4 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-lg font-medium text-text-main leading-relaxed">
                        {currentCard.question}
                    </p>
                </Card>

                {/* Options */}
                {currentCard.options && (
                    <div className="space-y-3">
                        {currentCard.options.map((option, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrectAnswer = idx === currentCard.correctAnswer;

                            let optionStyle = 'border-gray-200 dark:border-gray-700 bg-surface';
                            if (showAnswer) {
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
                                    onClick={() => handleSelectAnswer(idx)}
                                    disabled={showAnswer}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionStyle}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${showAnswer && isCorrectAnswer
                                                ? 'bg-primary text-white'
                                                : isSelected
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-text-secondary'
                                            }`}>
                                            {labels[idx]}
                                        </div>
                                        <span className="text-text-main flex-1">{option}</span>
                                        {showAnswer && isCorrectAnswer && (
                                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                check_circle
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            {!showAnswer ? (
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-surface border-t border-border z-40">
                    <div className="max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleCheck}
                            disabled={selectedAnswer === null}
                        >
                            PERIKSA
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={`fixed bottom-0 left-0 lg:left-64 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] ${isCorrect ? 'bg-[#e8f8ed]' : 'bg-[#fef3eb]'
                    } border-t-4 ${isCorrect ? 'border-primary' : 'border-[#F4A261]'} p-4 rounded-t-3xl`}>
                    <div className="max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto">
                        {/* Feedback Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-primary' : 'bg-[#F4A261]'
                                } text-white`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {isCorrect ? 'check' : 'close'}
                                </span>
                            </div>
                            <div>
                                <h3 className={`font-bold ${isCorrect ? 'text-primary' : 'text-[#c26d2b]'}`}>
                                    {isCorrect ? 'Benar! 🎉' : 'Kurang Tepat'}
                                </h3>
                                <p className="text-sm text-text-secondary">
                                    Seberapa mudah kamu mengingatnya?
                                </p>
                            </div>
                        </div>

                        {/* Rating Buttons */}
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => handleRate(QUALITY.AGAIN)}
                                className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 text-center hover:bg-red-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">refresh</span>
                                <div className="text-xs font-medium mt-1">Lagi</div>
                            </button>
                            <button
                                onClick={() => handleRate(QUALITY.HARD)}
                                className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-center hover:bg-amber-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">trending_down</span>
                                <div className="text-xs font-medium mt-1">Sulit</div>
                            </button>
                            <button
                                onClick={() => handleRate(QUALITY.GOOD)}
                                className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-center hover:bg-blue-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">thumb_up</span>
                                <div className="text-xs font-medium mt-1">Baik</div>
                            </button>
                            <button
                                onClick={() => handleRate(QUALITY.EASY)}
                                className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 text-center hover:bg-green-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">bolt</span>
                                <div className="text-xs font-medium mt-1">Mudah</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default SRSReviewPage;
