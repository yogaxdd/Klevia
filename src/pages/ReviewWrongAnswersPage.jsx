import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import soundService from '../services/soundService';
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

    const wrongAnswers = userData?.wrongAnswers || [];

    const currentQuestion = wrongAnswers[currentIndex];

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
            soundService.playCorrect();
            setMasteredCount(prev => prev + 1);

            // Remove from wrong answers
            const updatedWrongAnswers = wrongAnswers.filter((_, i) => i !== currentIndex);
            updateUserData({ wrongAnswers: updatedWrongAnswers });
        } else {
            soundService.playWrong();
        }
    };

    const handleNext = () => {
        // If we answered correctly, the array was shortened, so don't increment
        const newWrongAnswers = userData?.wrongAnswers || [];

        if (isCorrect) {
            // Array was shortened, check if there are more
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
    };

    if (wrongAnswers.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="text-center">
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

                    <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / wrongAnswers.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Review Badge */}
                    <div className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm">replay</span>
                        <span className="text-xs font-bold">{wrongAnswers.length}</span>
                    </div>
                </div>

                <p className="text-center text-sm text-text-secondary">
                    Review Jawaban Salah • {currentIndex + 1} dari {wrongAnswers.length}
                </p>
            </header>

            {/* Question Content */}
            <div className="flex-1 px-4 pb-4 overflow-y-auto">
                {/* Lesson Info */}
                <div className="mb-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-text-secondary">
                        {currentQuestion?.lessonTitle || 'Review'}
                    </span>
                </div>

                {/* Question Card */}
                <Card className="mb-4">
                    <p className="text-lg font-medium text-text-main leading-relaxed">
                        {currentQuestion?.question}
                    </p>
                </Card>

                {/* Answer Options */}
                <div className="space-y-3">
                    {currentQuestion?.options?.map((option, index) => (
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
                                {isCorrect ? 'Sekarang Paham! ✨' : 'Belum Tepat'}
                            </h3>
                            {!isCorrect && (
                                <p className="text-sm text-red-500">
                                    Jawaban: {currentQuestion?.options?.[currentQuestion.correctAnswer]}
                                </p>
                            )}
                            {isCorrect && (
                                <p className="text-sm text-green-500">
                                    Dihapus dari daftar review!
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        <span>Lanjut</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReviewWrongAnswersPage;
