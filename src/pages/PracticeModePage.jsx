import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { questions } from '../data/allQuestions';
import { lessons } from '../data/allLessons';
import soundService from '../services/soundService';
import ProgressBar from '../components/ProgressBar';
import OptionCard from '../components/OptionCard';
import Button from '../components/Button';
import Card from '../components/Card';

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
    const { user } = useApp();

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
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

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
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="px-4 pt-6 pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={handleClose}
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <span className="material-symbols-outlined text-text-main">close</span>
                    </button>

                    <div className="flex-1">
                        <ProgressBar value={progress} max={100} size="md" />
                    </div>

                    {/* Practice Mode Badge */}
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm">fitness_center</span>
                        <span className="text-xs font-bold">Latihan</span>
                    </div>
                </div>

                <p className="text-center text-sm text-text-secondary">
                    Mode Latihan • Soal {currentQuestionIndex + 1} dari {totalQuestions}
                </p>
            </header>

            {/* Question Content */}
            <div className="flex-1 px-4 pb-4 overflow-y-auto" key={questionKey}>
                {/* Question Card */}
                <Card className={`mb-4 ${showShake ? 'animate-shake' : ''}`}>
                    <p className="text-lg font-medium text-text-main leading-relaxed">
                        {currentQuestion.question}
                    </p>
                </Card>

                {/* Answer Options */}
                <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                        <OptionCard
                            key={index}
                            label={String.fromCharCode(65 + index)}
                            text={option}
                            selected={selectedAnswer === index}
                            correct={isAnswered && index === currentQuestion.correctAnswer}
                            wrong={isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer}
                            onClick={() => handleSelectAnswer(index)}
                            disabled={isAnswered}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Action */}
            {!isAnswered ? (
                <div className="p-4 border-t border-gray-100 bg-white">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleCheck}
                        disabled={selectedAnswer === null}
                    >
                        Periksa Jawaban
                    </Button>
                </div>
            ) : (
                <div className={`${isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border-t-4 p-5 rounded-t-3xl`}>
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
                                    Jawaban: {currentQuestion.options?.[currentQuestion.correctAnswer]}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        <span>{currentQuestionIndex < totalQuestions - 1 ? 'Lanjut' : 'Selesai'}</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default PracticeModePage;
