import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { questions } from '../data/allQuestions';
import { lessons } from '../data/allLessons';
import soundService from '../services/soundService';
import ProgressBar from '../components/ProgressBar';
import OptionCard from '../components/OptionCard';
import Button from '../components/Button';

// Fisher-Yates shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleQuestionOptions(question) {
    if (question.type === 'essay') return question;

    const originalOptions = question.options;
    const correctAnswerText = originalOptions[question.correctAnswer];
    const shuffledOptions = shuffleArray(originalOptions);
    const newCorrectAnswer = shuffledOptions.indexOf(correctAnswerText);

    return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswer
    };
}

function PracticeModePage() {
    const navigate = useNavigate();
    const { lessonId } = useParams();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [showShake, setShowShake] = useState(false);
    const [questionKey, setQuestionKey] = useState(0);

    // Get lesson info
    const lesson = useMemo(() => {
        return lessons.find(l => l.id === parseInt(lessonId));
    }, [lessonId]);

    // Get and prepare questions
    const preparedQuestions = useMemo(() => {
        const lessonQuestions = questions[lessonId] || [];
        // Only MCQ for practice
        const mcqOnly = lessonQuestions.filter(q => q.options && q.options.length > 0);
        const shuffledQuestions = shuffleArray(mcqOnly);
        return shuffledQuestions.map(q => shuffleQuestionOptions(q));
    }, [lessonId]);

    const totalQuestions = preparedQuestions.length;
    const currentQuestion = preparedQuestions[currentQuestionIndex];
    // Match LessonPage logic for progress/labels
    const labels = ['A', 'B', 'C', 'D'];
    const correctAnswerText = currentQuestion?.options?.[currentQuestion.correctAnswer];

    // Navigate away if no questions
    useEffect(() => {
        if (totalQuestions === 0) {
            navigate('/levels');
        }
    }, [totalQuestions, navigate]);

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
            soundService.playCorrect();
        } else {
            soundService.playWrong();
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setIsCorrect(null);
            setQuestionKey(prev => prev + 1);
        } else {
            // Practice completed
            navigate('/practice-complete', {
                state: {
                    score,
                    totalQuestions,
                    lessonTitle: lesson?.title
                }
            });
        }
    };

    const handleClose = () => {
        navigate('/levels');
    };

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen flex flex-col relative">
            {/* Top Bar - Matches LessonPage structure */}
            <div className="flex items-center justify-between px-4 py-3 bg-background shrink-0">
                <button
                    onClick={handleClose}
                    className="flex items-center justify-center p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <div className="flex-1 mx-4">
                    <ProgressBar
                        value={currentQuestionIndex + 1}
                        max={totalQuestions}
                        size="lg"
                    />
                </div>

                {/* Practice Badge instead of Hearts */}
                <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-sm font-bold">fitness_center</span>
                    <span className="text-xs font-bold">Latihan</span>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center w-full max-w-md mx-auto ${isAnswered && !isCorrect ? 'pb-72' : ''}`}>

                <div className="w-full text-center mb-4 text-sm text-text-secondary">
                    Soal {currentQuestionIndex + 1} dari {totalQuestions}
                </div>

                {/* Question Type Badge */}
                <div className="w-full mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <span className="material-symbols-outlined text-sm">quiz</span>
                        Pilihan Ganda
                    </span>
                </div>

                {/* Question Section */}
                <div className="w-full mb-6">
                    <h2 className="text-lg font-bold text-text-main mb-4 leading-tight">
                        Pilihlah jawaban yang paling tepat.
                    </h2>

                    {/* Question Card - Exact LessonPage style */}
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

                {/* Multiple Choice Options */}
                <div
                    key={`opts-${questionKey}`}
                    className={`w-full flex flex-col gap-3 pb-4 stagger-children ${showShake ? 'animate-shake' : ''}`}
                >
                    {currentQuestion.options?.map((option, index) => (
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
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check
                                </span>
                            </div>
                            <div>
                                <h3 className="text-primary text-xl font-bold tracking-tight">
                                    Jawaban Benar! 🎉
                                </h3>
                                <p className="text-green-700 text-sm">
                                    Kerja bagus! Lanjutkan.
                                </p>
                            </div>
                        </div>

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

            {/* Incorrect Answer - Bottom Sheet */}
            {isAnswered && !isCorrect && (
                <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    <div className="bg-[#fef3eb] border-[#F4A261] border-t-4 p-5 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#F4A261] text-white shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    priority_high
                                </span>
                            </div>
                            <div>
                                <h3 className="text-[#c26d2b] text-xl font-bold tracking-tight">
                                    Jawaban Kurang Tepat
                                </h3>
                                <p className="text-[#a67c52] text-sm">
                                    Jangan menyerah, tetap semangat! 💪
                                </p>
                            </div>
                        </div>

                        {/* Correct Answer Card */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                                Jawaban yang benar:
                            </p>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/20 text-primary font-bold text-sm shrink-0">
                                    {labels[currentQuestion.correctAnswer]}
                                </div>
                                <p className="text-primary text-base font-medium leading-relaxed">{correctAnswerText}</p>
                            </div>
                        </div>

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
                <div className="w-full bg-white border-t border-gray-100 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] fixed bottom-0 left-0 right-0 sm:static">
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

export default PracticeModePage;
