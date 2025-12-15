import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import soundService from '../services/soundService';
import ProgressBar from '../components/ProgressBar';
import Card from '../components/Card';
import Button from '../components/Button';
import OptionCard from '../components/OptionCard';

function ReviewWrongAnswersPage() {
    const navigate = useNavigate();
    const { userData, updateUserData } = useAuth();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [masteredCount, setMasteredCount] = useState(0);
    const [showShake, setShowShake] = useState(false);
    const [answeredQuestion, setAnsweredQuestion] = useState(null); // Store the question being answered

    const wrongAnswers = userData?.wrongAnswers || [];
    const currentQuestion = answeredQuestion || wrongAnswers[currentIndex]; // Use answeredQuestion if set

    // Labels for options
    const labels = ['A', 'B', 'C', 'D'];
    const correctAnswerText = currentQuestion?.options?.[currentQuestion.correctAnswer];

    const handleSelectAnswer = (index) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
    };

    const handleCheck = () => {
        if (selectedAnswer === null) return;

        // Store the question before potentially modifying the array
        setAnsweredQuestion(wrongAnswers[currentIndex]);

        const correct = selectedAnswer === wrongAnswers[currentIndex].correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            soundService.playCorrect();
            setMasteredCount(prev => prev + 1);

            // Remove from wrong answers
            const updatedWrongAnswers = wrongAnswers.filter((_, i) => i !== currentIndex);
            updateUserData({ wrongAnswers: updatedWrongAnswers });
        } else {
            soundService.playWrong();
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
        }
    };

    const handleNext = () => {
        // If we answered correctly, the array was shortened
        const newWrongAnswers = userData?.wrongAnswers || [];

        if (isCorrect) {
            // Array was shortened
            if (currentIndex < newWrongAnswers.length) {
                // Stay at same index (next item shifted down)
            } else if (newWrongAnswers.length > 0) {
                setCurrentIndex(0);
            } else {
                // All mastered!
                navigate('/review-complete', { state: { masteredCount: masteredCount } });
                return;
            }
        } else {
            // Move to next
            if (currentIndex < newWrongAnswers.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else if (newWrongAnswers.length > 0) {
                setCurrentIndex(0); // Loop back
            }
        }

        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsCorrect(null);
        setAnsweredQuestion(null); // Clear the answered question
    };

    if (wrongAnswers.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="text-center animate-fadeIn">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-green-600"
                            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
                        >
                            verified
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main mb-2">Keren! 🎉</h1>
                    <p className="text-text-secondary mb-6">
                        Tidak ada jawaban salah yang perlu direview.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/home')}>
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen flex flex-col relative">
            {/* Top Bar - Matches LessonPage structure */}
            <div className="flex items-center justify-between px-4 py-3 bg-background shrink-0">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center justify-center p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <div className="flex-1 mx-4">
                    <ProgressBar
                        value={currentIndex + 1}
                        max={wrongAnswers.length}
                        size="lg"
                        color="red" // Red progress bar for review mode
                    />
                </div>

                {/* Review Badge */}
                <div className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-sm font-bold">replay</span>
                    <span className="text-xs font-bold">{wrongAnswers.length}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center w-full max-w-md mx-auto ${isAnswered && !isCorrect ? 'pb-72' : ''}`}>

                <div className="w-full text-center mb-4 text-sm text-text-secondary">
                    Review Jawaban Salah • {currentIndex + 1} dari {wrongAnswers.length}
                </div>

                {/* Question Type Badge */}
                <div className="w-full mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <span className="material-symbols-outlined text-sm">history_edu</span>
                        Review
                    </span>
                </div>

                {/* Question Section */}
                <div className="w-full mb-6">
                    <h2 className="text-lg font-bold text-text-main mb-4 leading-tight">
                        Coba kerjakan ulang soal ini:
                    </h2>

                    {/* Question Card - Matches LessonPage */}
                    <div className={`bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 mb-6 animate-fadeIn ${showShake ? 'animate-shake' : ''}`}>
                        <div className="p-5">
                            <p className="text-xl font-bold text-text-main leading-tight">
                                {currentQuestion?.question}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Answer Options */}
                <div className="w-full flex flex-col gap-3 pb-4 stagger-children">
                    {currentQuestion?.options?.map((option, index) => (
                        <OptionCard
                            key={index}
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
                                    Sekarang Paham! ✨
                                </h3>
                                <p className="text-green-700 text-sm">
                                    Soal ini telah dihapus dari daftar review.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full bg-primary hover:bg-[#2fd165] active:scale-[0.98] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>Lanjut</span>
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
                                    Belum Tepat
                                </h3>
                                <p className="text-[#a67c52] text-sm">
                                    Coba ingat-ingat lagi materi ini ya!
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
                            <span>Lanjut</span>
                            <span className="material-symbols-outlined font-bold">arrow_forward</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Default Bottom Bar */}
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

export default ReviewWrongAnswersPage;
