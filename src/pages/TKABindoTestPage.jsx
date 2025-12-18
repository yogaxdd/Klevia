import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import HeartDisplay from '../components/HeartDisplay';
import Button from '../components/Button';
import OptionCard from '../components/OptionCard';
import MultiSelectOptionCard from '../components/MultiSelectOptionCard';
import TrueFalseRow from '../components/TrueFalseRow';
import questionsTKABindo from '../data/questionsTKABindo';

function TKABindoTestPage() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // for multiple_choice
    const [selectedAnswers, setSelectedAnswers] = useState([]); // for multiple_answer
    const [trueFalseAnswers, setTrueFalseAnswers] = useState({}); // for true_false
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [results, setResults] = useState({}); // for true_false results
    const [hearts, setHearts] = useState(5);
    const [showShake, setShowShake] = useState(false);
    const [questionKey, setQuestionKey] = useState(0);

    const questions = questionsTKABindo;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const resetQuestionState = () => {
        setSelectedAnswer(null);
        setSelectedAnswers([]);
        setTrueFalseAnswers({});
        setIsAnswered(false);
        setIsCorrect(null);
        setResults({});
        setQuestionKey(prev => prev + 1);
    };

    const handleMultipleChoiceSelect = (index) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
    };

    const handleMultipleAnswerToggle = (index) => {
        if (isAnswered) return;
        setSelectedAnswers(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleTrueFalseChange = (statementIndex, value) => {
        if (isAnswered) return;
        setTrueFalseAnswers(prev => ({
            ...prev,
            [statementIndex]: value
        }));
    };

    const canCheck = () => {
        if (currentQuestion.questionType === 'multiple_choice') {
            return selectedAnswer !== null;
        } else if (currentQuestion.questionType === 'multiple_answer') {
            return selectedAnswers.length > 0;
        } else if (currentQuestion.questionType === 'true_false') {
            return Object.keys(trueFalseAnswers).length === currentQuestion.statements.length;
        }
        return false;
    };

    const handleCheck = () => {
        if (!canCheck()) return;

        let correct = false;

        if (currentQuestion.questionType === 'multiple_choice') {
            correct = selectedAnswer === currentQuestion.correctAnswer;
        } else if (currentQuestion.questionType === 'multiple_answer') {
            const correctSet = new Set(currentQuestion.correctAnswers);
            const selectedSet = new Set(selectedAnswers);
            correct = correctSet.size === selectedSet.size &&
                [...correctSet].every(x => selectedSet.has(x));
        } else if (currentQuestion.questionType === 'true_false') {
            const newResults = {};
            let allCorrect = true;
            currentQuestion.statements.forEach((statement, index) => {
                const userAnswer = trueFalseAnswers[index];
                const isStatementCorrect = userAnswer === statement.correctAnswer;
                newResults[index] = isStatementCorrect;
                if (!isStatementCorrect) allCorrect = false;
            });
            setResults(newResults);
            correct = allCorrect;
        }

        setIsCorrect(correct);
        setIsAnswered(true);

        if (!correct) {
            setHearts(prev => Math.max(0, prev - 1));
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
        } else {
            navigate('/home');
        }
    };

    const handleClose = () => {
        navigate('/home');
    };

    const getQuestionTypeBadge = () => {
        if (currentQuestion.questionType === 'multiple_choice') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                    <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                    Pilihan Ganda
                </span>
            );
        } else if (currentQuestion.questionType === 'multiple_answer') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    <span className="material-symbols-outlined text-sm">check_box</span>
                    Pilihan Ganda (lebih dari satu)
                </span>
            );
        } else if (currentQuestion.questionType === 'true_false') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <span className="material-symbols-outlined text-sm">fact_check</span>
                    {currentQuestion.optionLabels?.trueLabel || 'Benar'} / {currentQuestion.optionLabels?.falseLabel || 'Salah'}
                </span>
            );
        }
    };

    const renderOptions = () => {
        if (currentQuestion.questionType === 'multiple_choice') {
            return (
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <OptionCard
                            key={`${questionKey}-${index}`}
                            text={option}
                            selected={selectedAnswer === index}
                            correct={isAnswered ? (index === currentQuestion.correctAnswer ? true : (selectedAnswer === index ? false : null)) : null}
                            onClick={() => handleMultipleChoiceSelect(index)}
                            disabled={isAnswered}
                        />
                    ))}
                </div>
            );
        } else if (currentQuestion.questionType === 'multiple_answer') {
            return (
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let correctStatus = null;
                        if (isAnswered) {
                            const isInCorrectAnswers = currentQuestion.correctAnswers.includes(index);
                            const wasSelected = selectedAnswers.includes(index);
                            if (wasSelected && isInCorrectAnswers) correctStatus = true;
                            else if (wasSelected && !isInCorrectAnswers) correctStatus = false;
                            else if (!wasSelected && isInCorrectAnswers) correctStatus = 'missed';
                        }
                        return (
                            <MultiSelectOptionCard
                                key={`${questionKey}-${index}`}
                                text={option}
                                selected={selectedAnswers.includes(index)}
                                correct={correctStatus}
                                onClick={() => handleMultipleAnswerToggle(index)}
                                disabled={isAnswered}
                            />
                        );
                    })}
                </div>
            );
        } else if (currentQuestion.questionType === 'true_false') {
            return (
                <div className={`bg-surface rounded-2xl shadow-soft border border-border overflow-hidden ${showShake ? 'animate-shake' : ''}`}>
                    {/* Table Header */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-border">
                        <div className="flex-1 min-w-0">
                            <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                                Pernyataan
                            </span>
                        </div>
                        <div className="w-12 text-center">
                            <span className="text-xs font-bold text-text-secondary uppercase">
                                {currentQuestion.optionLabels?.trueLabel || 'Benar'}
                            </span>
                        </div>
                        <div className="w-12 text-center">
                            <span className="text-xs font-bold text-text-secondary uppercase">
                                {currentQuestion.optionLabels?.falseLabel || 'Salah'}
                            </span>
                        </div>
                    </div>
                    {/* Statement Rows */}
                    {currentQuestion.statements.map((statement, index) => (
                        <TrueFalseRow
                            key={`${questionKey}-${index}`}
                            statement={statement.text}
                            value={trueFalseAnswers[index] ?? null}
                            correct={isAnswered ? results[index] : null}
                            correctAnswer={statement.correctAnswer}
                            onChange={(val) => handleTrueFalseChange(index, val)}
                            disabled={isAnswered}
                            trueLabel={currentQuestion.optionLabels?.trueLabel || 'Benar'}
                            falseLabel={currentQuestion.optionLabels?.falseLabel || 'Salah'}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="bg-background min-h-screen flex flex-col relative">
            {/* Top Bar */}
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

                <HeartDisplay hearts={hearts} />
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center w-full max-w-2xl mx-auto ${isAnswered && !isCorrect ? 'pb-80' : 'pb-36'}`}>
                {/* Question Type Badge */}
                <div className="w-full mb-2">
                    {getQuestionTypeBadge()}
                </div>

                {/* Reading Passage (if exists) */}
                {currentQuestion.readingPassage && (
                    <div
                        key={`passage-${questionKey}`}
                        className="w-full bg-surface rounded-2xl shadow-soft overflow-hidden border border-border mb-4 animate-fadeIn"
                    >
                        <div className="p-4 max-h-48 overflow-y-auto">
                            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                                {currentQuestion.readingPassage}
                            </p>
                        </div>
                    </div>
                )}

                {/* Question Card */}
                <div
                    key={`q-${questionKey}`}
                    className="w-full bg-surface rounded-2xl shadow-soft overflow-hidden border border-border mb-4 animate-fadeIn"
                >
                    <div className="p-5">
                        <p className="text-lg font-bold text-text-main leading-tight whitespace-pre-line">
                            {currentQuestion.question}
                        </p>
                    </div>
                </div>

                {/* Options */}
                <div className="w-full">
                    {renderOptions()}
                </div>

                {/* Progress indicator for true_false */}
                {currentQuestion.questionType === 'true_false' && !isAnswered && (
                    <div className="w-full mt-4 text-center">
                        <span className="text-sm text-text-secondary">
                            {Object.keys(trueFalseAnswers).length} dari {currentQuestion.statements.length} pernyataan dijawab
                        </span>
                    </div>
                )}
            </div>

            {/* Correct Answer - Bottom Sheet (Green) */}
            {isAnswered && isCorrect && (
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
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
                                {currentQuestion.explanation && (
                                    <p className="text-green-700 text-sm mt-1">
                                        {currentQuestion.explanation}
                                    </p>
                                )}
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

            {/* Incorrect Answer - Bottom Sheet (Orange) */}
            {isAnswered && !isCorrect && (
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    <div className="bg-[#fef3eb] dark:bg-orange-900/30 border-t-4 border-[#F4A261] p-5 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
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
                        <div className="bg-surface rounded-2xl p-4 border border-border mb-4 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                                Jawaban yang benar:
                            </p>
                            <div className="flex flex-col gap-1">
                                {currentQuestion.questionType === 'multiple_choice' && (
                                    <p className="text-primary text-sm font-medium leading-relaxed flex items-start gap-2">
                                        <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        {currentQuestion.options[currentQuestion.correctAnswer]}
                                    </p>
                                )}
                                {currentQuestion.questionType === 'multiple_answer' && currentQuestion.correctAnswers.map((idx, i) => (
                                    <p key={i} className="text-primary text-sm font-medium leading-relaxed flex items-start gap-2">
                                        <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        {currentQuestion.options[idx]}
                                    </p>
                                ))}
                                {currentQuestion.questionType === 'true_false' && currentQuestion.statements.map((statement, i) => (
                                    <p key={i} className="text-primary text-sm font-medium leading-relaxed flex items-start gap-2">
                                        <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        <span>
                                            <span className="font-bold">{statement.correctAnswer ? (currentQuestion.optionLabels?.trueLabel || 'Benar') : (currentQuestion.optionLabels?.falseLabel || 'Salah')}</span>
                                            {' - '}
                                            {statement.text.length > 60 ? statement.text.substring(0, 60) + '...' : statement.text}
                                        </span>
                                    </p>
                                ))}
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
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 w-auto bg-surface border-t border-border p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] dark:shadow-none z-40">
                    <div className="max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto w-full">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleCheck}
                            disabled={!canCheck()}
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

export default TKABindoTestPage;
