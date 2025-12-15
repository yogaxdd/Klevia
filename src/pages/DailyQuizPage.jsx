import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { questions as allQuestions } from '../data/allQuestions';
import { gradeEssayAnswer } from '../services/geminiService';
import soundService from '../services/soundService';
import Card from '../components/Card';

function DailyQuizPage() {
    const navigate = useNavigate();
    const { currentUser, userData, updateUserData, addXP } = useAuth();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [essayAnswer, setEssayAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isGrading, setIsGrading] = useState(false);
    const [aiFeedback, setAiFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [dailyQuestions, setDailyQuestions] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [alreadyDoneToday, setAlreadyDoneToday] = useState(false);
    const [loading, setLoading] = useState(true);

    const QUESTIONS_PER_DAY = 5;
    const XP_REWARD = 100;

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const seededRandom = (seed) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    useEffect(() => {
        initializeDailyQuiz();
    }, [userData]);

    const initializeDailyQuiz = () => {
        setLoading(true);

        const lastQuizDate = userData?.dailyQuiz?.lastCompleted;
        const today = getTodayString();

        if (lastQuizDate === today) {
            setAlreadyDoneToday(true);
            setLoading(false);
            return;
        }

        // Flatten all questions - ONLY MCQ for daily quiz (has options)
        const allQuestionsFlat = [];
        Object.entries(allQuestions).forEach(([lessonId, lessonQuestions]) => {
            if (Array.isArray(lessonQuestions)) {
                lessonQuestions.forEach((q, idx) => {
                    // Only include MCQ (questions with options)
                    if (q.options && q.options.length > 0) {
                        allQuestionsFlat.push({
                            ...q,
                            id: `${lessonId}-${idx}`,
                            lessonId: parseInt(lessonId)
                        });
                    }
                });
            }
        });

        const dateSeed = parseInt(today.replace(/-/g, ''));
        const shuffled = [...allQuestionsFlat].sort(() => seededRandom(dateSeed) - 0.5);
        const todaysQuestions = shuffled.slice(0, QUESTIONS_PER_DAY);

        // Shuffle options
        const preparedQuestions = todaysQuestions.map(q => {
            const correctAnswer = q.options[q.correctAnswer];
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

            return {
                ...q,
                options: shuffledOptions,
                correctAnswer: newCorrectIndex
            };
        });

        setDailyQuestions(preparedQuestions);
        setLoading(false);
    };

    const handleMCQAnswer = (index) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        setIsAnswered(true);

        const correct = index === dailyQuestions[currentIndex].correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
            soundService.playCorrect();
        } else {
            soundService.playWrong();
        }
    };

    const handleNext = async () => {
        if (currentIndex < QUESTIONS_PER_DAY - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setEssayAnswer('');
            setIsAnswered(false);
            setIsCorrect(null);
            setAiFeedback('');
        } else {
            setIsCompleted(true);

            if (currentUser) {
                const finalScore = score + (isCorrect ? 1 : 0);
                await updateUserData({
                    dailyQuiz: {
                        lastCompleted: getTodayString(),
                        lastScore: finalScore
                    }
                });
                await addXP(XP_REWARD);
            }
        }
    };

    const currentQuestion = dailyQuestions[currentIndex];
    const progress = ((currentIndex + 1) / QUESTIONS_PER_DAY) * 100;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (alreadyDoneToday) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main mb-2">Kuis Selesai!</h1>
                    <p className="text-text-secondary mb-2">Kamu sudah menyelesaikan kuis hari ini.</p>
                    <p className="text-text-secondary mb-6">Kembali lagi besok untuk kuis baru! 🌟</p>

                    <Card className="mb-6 text-center">
                        <p className="text-sm text-text-secondary">Skor terakhir</p>
                        <p className="text-3xl font-bold text-primary">{userData?.dailyQuiz?.lastScore || 0}/{QUESTIONS_PER_DAY}</p>
                    </Card>

                    <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    if (isCompleted) {
        const finalScore = score;
        const isPerfect = finalScore === QUESTIONS_PER_DAY;

        return (
            <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex flex-col items-center justify-center px-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">{isPerfect ? '🏆' : '🎉'}</div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">
                        {isPerfect ? 'Sempurna!' : 'Kuis Selesai!'}
                    </h1>
                    <p className="text-text-secondary mb-6">Kamu sudah menyelesaikan kuis harian</p>

                    <Card className="mb-4">
                        <div className="text-center">
                            <p className="text-sm text-text-secondary">Skor Kamu</p>
                            <p className="text-4xl font-bold text-primary my-2">{finalScore}/{QUESTIONS_PER_DAY}</p>
                            <div className="flex items-center justify-center gap-2 text-amber-500">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="font-bold">+{XP_REWARD} XP</span>
                            </div>
                        </div>
                    </Card>

                    <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="px-4 pt-6 pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <span className="material-symbols-outlined text-text-main">close</span>
                    </button>

                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center gap-1 text-primary font-bold">
                        <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span>{XP_REWARD}</span>
                    </div>
                </div>

                <p className="text-center text-sm text-text-secondary">
                    Kuis Harian • Soal {currentIndex + 1} dari {QUESTIONS_PER_DAY}
                </p>
            </header>

            {/* Question */}
            <div className="flex-1 px-4 pb-4">
                <Card className="mb-4">
                    <p className="text-lg font-medium text-text-main leading-relaxed">
                        {currentQuestion?.question}
                    </p>
                </Card>

                {/* MCQ Options */}
                <div className="space-y-3">
                    {currentQuestion?.options?.map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrectAnswer = idx === currentQuestion.correctAnswer;

                        let bgClass = 'bg-surface border-2 border-gray-200 dark:border-gray-600 hover:border-primary/50';
                        if (isAnswered) {
                            if (isCorrectAnswer) {
                                bgClass = 'bg-green-50 dark:bg-green-900/30 border-2 border-green-500';
                            } else if (isSelected && !isCorrectAnswer) {
                                bgClass = 'bg-red-50 dark:bg-red-900/30 border-2 border-red-500';
                            }
                        } else if (isSelected) {
                            bgClass = 'bg-primary/10 border-2 border-primary';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleMCQAnswer(idx)}
                                disabled={isAnswered}
                                className={`w-full p-4 rounded-2xl text-left transition-all ${bgClass}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isAnswered && isCorrectAnswer ? 'bg-green-500 text-white' :
                                        isAnswered && isSelected && !isCorrectAnswer ? 'bg-red-500 text-white' :
                                            isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-text-main">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom feedback & button */}
            {isAnswered && (
                <div className={`${isCorrect ? 'bg-green-50 dark:bg-green-900/30 border-green-400' : 'bg-red-50 dark:bg-red-900/30 border-red-400'} border-t-4 p-5 rounded-t-3xl`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {isCorrect ? 'check' : 'close'}
                            </span>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {isCorrect ? 'Jawaban Benar! 🎉' : 'Jawaban Kurang Tepat'}
                            </h3>
                            {!isCorrect && (
                                <p className="text-sm text-red-500">
                                    Jawaban: {currentQuestion?.options?.[currentQuestion.correctAnswer]}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        <span>{currentIndex < QUESTIONS_PER_DAY - 1 ? 'Lanjut' : 'Selesai'}</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default DailyQuizPage;
