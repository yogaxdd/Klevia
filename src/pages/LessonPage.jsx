import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { questions } from '../data/questions';
import { lessons } from '../data/lessons';
import ProgressBar from '../components/ProgressBar';
import HeartDisplay from '../components/HeartDisplay';
import OptionCard from '../components/OptionCard';
import Button from '../components/Button';

function LessonPage() {
    const navigate = useNavigate();
    const { lessonId } = useParams();
    const { user, currentHearts, loseHeart, resetHearts, addXP, completeLesson } = useApp();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showShake, setShowShake] = useState(false);
    const [questionKey, setQuestionKey] = useState(0);

    const lessonQuestions = questions[lessonId] || [];
    const lesson = lessons.find(l => l.id === parseInt(lessonId));
    const currentQuestion = lessonQuestions[currentQuestionIndex];
    const totalQuestions = lessonQuestions.length;

    // Reset hearts when starting lesson
    useEffect(() => {
        resetHearts();
    }, []);

    // Check for game over
    useEffect(() => {
        if (currentHearts === 0) {
            navigate('/game-over');
        }
    }, [currentHearts, navigate]);

    const handleSelectAnswer = (index) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
    };

    const handleCheck = () => {
        if (selectedAnswer === null) return;

        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setScore(prev => prev + 1);
        } else {
            loseHeart();
            // Trigger shake animation
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setIsCorrect(null);
            setQuestionKey(prev => prev + 1); // Trigger re-animation
        } else {
            // Lesson completed - calculate XP based on correct answers
            const baseXP = lesson?.xpReward || 50;
            const xpPerQuestion = baseXP / totalQuestions;
            const xpEarned = Math.round(xpPerQuestion * score);

            // Check if passed (minimum 50% correct)
            const percentage = (score / totalQuestions) * 100;
            const passed = percentage >= 50;

            // Check if user will level up
            const currentXP = user.xp || 0;
            const currentLevel = user.level || 1;
            const newTotalXP = currentXP + xpEarned;
            const newLevel = Math.floor(newTotalXP / 100) + 1;
            const willLevelUp = passed && newLevel > currentLevel;

            // Only give XP and mark complete if passed
            if (passed) {
                addXP(xpEarned);
                completeLesson(lessonId, score, totalQuestions);
            }

            // Navigate to level up page first if leveling up, otherwise to win page
            if (willLevelUp) {
                navigate('/level-up', {
                    state: {
                        newLevel,
                        xpEarned,
                        score,
                        totalQuestions,
                        passed,
                        lessonId
                    }
                });
            } else {
                navigate('/win', {
                    state: {
                        xpEarned: passed ? xpEarned : 0,
                        score,
                        totalQuestions,
                        passed,
                        lessonId
                    }
                });
            }
        }
    };

    const handleClose = () => {
        navigate('/levels');
    };

    if (!currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-secondary">Soal tidak ditemukan</p>
            </div>
        );
    }

    const labels = ['A', 'B', 'C', 'D'];
    const correctAnswerText = currentQuestion.options[currentQuestion.correctAnswer];

    return (
        <div className="bg-background min-h-screen flex flex-col relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-background shrink-0">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="flex items-center justify-center p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                {/* Progress Bar */}
                <div className="flex-1 mx-4">
                    <ProgressBar
                        value={currentQuestionIndex + 1}
                        max={totalQuestions}
                        size="lg"
                    />
                </div>

                {/* Hearts */}
                <HeartDisplay hearts={currentHearts} />
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center w-full max-w-md mx-auto ${isAnswered && !isCorrect ? 'pb-72' : ''}`}>
                {/* Question Section */}
                <div className="w-full mb-6">
                    <h2 className="text-lg font-bold text-text-main mb-4 leading-tight">
                        Pilihlah jawaban yang paling tepat.
                    </h2>

                    {/* Question Card */}
                    <div
                        key={`q-${questionKey}`}
                        className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 mb-6 animate-fadeIn"
                    >
                        <div className="p-5">
                            <p className="text-xl font-bold text-text-main leading-tight">
                                {currentQuestion.question}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Answer Options */}
                <div
                    key={`opts-${questionKey}`}
                    className={`w-full flex flex-col gap-3 pb-4 stagger-children ${showShake ? 'animate-shake' : ''}`}
                >
                    {currentQuestion.options.map((option, index) => (
                        <OptionCard
                            key={`${questionKey}-${index}`}
                            label={labels[index]}
                            text={option}
                            selected={selectedAnswer === index}
                            correct={isAnswered ? (
                                index === currentQuestion.correctAnswer ? true :
                                    selectedAnswer === index ? false : null
                            ) : null}
                            onClick={() => handleSelectAnswer(index)}
                            disabled={isAnswered}
                        />
                    ))}
                </div>
            </div>

            {/* Correct Answer - Bottom Sheet (Green) */}
            {isAnswered && isCorrect && (
                <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    <div className="bg-[#e8f8ed] border-t-4 border-primary p-5 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                        {/* Status Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check
                                </span>
                            </div>
                            <div>
                                <h3 className="text-primary text-xl font-bold tracking-tight">
                                    Benar! 🎉
                                </h3>
                                <p className="text-green-700 text-sm">Jawaban kamu tepat sekali!</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary hover:bg-[#2fd165] active:scale-[0.98] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>{currentQuestionIndex < totalQuestions - 1 ? 'Lanjut' : 'Selesai'}</span>
                            <span className="material-symbols-outlined font-bold">arrow_forward</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Incorrect Answer - Bottom Sheet (Orange/Soft) */}
            {isAnswered && !isCorrect && (
                <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    <div className="bg-[#fef3eb] border-t-4 border-[#F4A261] p-5 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                        {/* Status Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#F4A261] text-white shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    priority_high
                                </span>
                            </div>
                            <div>
                                <h3 className="text-[#c26d2b] text-xl font-bold tracking-tight">
                                    Jawaban kurang tepat
                                </h3>
                                <p className="text-[#a67c52] text-sm">Jangan menyerah, tetap semangat! 💪</p>
                            </div>
                        </div>

                        {/* Correct Answer Card */}
                        <div className="bg-white rounded-2xl p-4 border border-[#F4A261]/20 mb-4 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                                Jawaban yang benar:
                            </p>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/20 text-primary font-bold text-sm">
                                    {labels[currentQuestion.correctAnswer]}
                                </div>
                                <p className="text-primary text-lg font-bold">{correctAnswerText}</p>
                            </div>
                            {/* Explanation */}
                            {currentQuestion.explanation && (
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {currentQuestion.explanation}
                                </p>
                            )}
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary hover:bg-[#2fd165] active:scale-[0.98] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>{currentQuestionIndex < totalQuestions - 1 ? 'Lanjut' : 'Selesai'}</span>
                            <span className="material-symbols-outlined font-bold">arrow_forward</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Default Bottom Bar - Before Answer */}
            {!isAnswered && (
                <div className="w-full bg-white border-t border-gray-100 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                    <div className="max-w-md mx-auto w-full">
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
            )}

            {/* CSS Animation */}
            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}

export default LessonPage;
