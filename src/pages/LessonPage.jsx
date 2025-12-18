import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../firebase/AuthContext';
import { questions } from '../data/allQuestions';
import { lessons } from '../data/allLessons';
import { gradeEssayAnswer, getSubjectLabel } from '../services/geminiService';
import { addToSRS } from '../services/srsService';
import soundService from '../services/soundService';
import ProgressBar from '../components/ProgressBar';
import HeartDisplay from '../components/HeartDisplay';
import OptionCard from '../components/OptionCard';
import MultiSelectOptionCard from '../components/MultiSelectOptionCard';
import TrueFalseRow from '../components/TrueFalseRow';
import Button from '../components/Button';

// Fisher-Yates shuffle untuk mengacak array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Fungsi untuk mengacak opsi jawaban dan menyesuaikan correctAnswer
function shuffleQuestionOptions(question) {
    // Skip shuffling for essay questions
    if (question.type === 'essay') {
        return question;
    }

    const originalOptions = question.options;
    const correctAnswerText = originalOptions[question.correctAnswer];

    // Buat array dengan index untuk tracking
    const optionsWithIndex = originalOptions.map((opt, idx) => ({ text: opt, originalIndex: idx }));

    // Shuffle options
    const shuffledOptions = shuffleArray(optionsWithIndex);

    // Temukan index baru dari jawaban yang benar
    const newCorrectAnswer = shuffledOptions.findIndex(opt => opt.text === correctAnswerText);

    return {
        ...question,
        options: shuffledOptions.map(opt => opt.text),
        correctAnswer: newCorrectAnswer
    };
}

// Convert some multiple choice questions to essay (random ~20-40%)
function convertToEssayQuestions(questionsArr) {
    if (!questionsArr || questionsArr.length === 0) return questionsArr;

    // Determine how many to convert (1-2 out of 5)
    const numToConvert = Math.min(2, Math.max(1, Math.floor(questionsArr.length * 0.3)));

    // Get random indices to convert
    const indices = [];
    while (indices.length < numToConvert) {
        const idx = Math.floor(Math.random() * questionsArr.length);
        if (!indices.includes(idx)) {
            indices.push(idx);
        }
    }

    return questionsArr.map((q, idx) => {
        if (indices.includes(idx) && q.options && q.options.length > 0) {
            // Convert to essay
            return {
                ...q,
                type: 'essay',
                expectedAnswer: q.options[q.correctAnswer], // Use correct answer as expected
                maxLength: 200
            };
        }
        return { ...q, type: q.type || 'multiple_choice' };
    });
}

function LessonPage() {
    const navigate = useNavigate();
    const { lessonId } = useParams();
    const { user, currentHearts, loseHeart, resetHearts, addXP, completeLesson } = useApp();
    const { userData, updateUserData } = useAuth();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]); // for multiple_answer
    const [trueFalseAnswers, setTrueFalseAnswers] = useState({}); // for true_false
    const [trueFalseResults, setTrueFalseResults] = useState({}); // for true_false results
    const [essayAnswer, setEssayAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isPartial, setIsPartial] = useState(false);
    const [aiFeedback, setAiFeedback] = useState('');
    const [isGrading, setIsGrading] = useState(false);
    const [score, setScore] = useState(0);
    const [showShake, setShowShake] = useState(false);
    const [questionKey, setQuestionKey] = useState(0);

    const rawLessonQuestions = questions[lessonId] || [];
    const lesson = lessons.find(l => l.id === parseInt(lessonId));

    // Check if this is a TKA lesson (subject starts with 'tka')
    const isTKALesson = lesson?.subject === 'tka';
    const isPremium = userData?.isPremium || false;

    // Redirect non-premium users away from TKA lessons
    useEffect(() => {
        if (isTKALesson && !isPremium) {
            navigate('/levels', { replace: true });
        }
    }, [isTKALesson, isPremium, navigate]);

    // Shuffle semua soal, convert some to essay (except TKA), dan acak opsi jawaban
    const lessonQuestions = useMemo(() => {
        // Shuffle urutan soal
        const shuffledQuestions = shuffleArray(rawLessonQuestions);
        // Convert some to essay - SKIP for TKA (TKA uses questionType field)
        const withEssay = isTKALesson ? shuffledQuestions.map(q => ({ ...q, type: q.questionType || 'multiple_choice' })) : convertToEssayQuestions(shuffledQuestions);
        // Shuffle options in multiple choice questions (skip for true_false)
        return withEssay.map(q => q.questionType === 'true_false' ? q : shuffleQuestionOptions(q));
    }, [lessonId, rawLessonQuestions.length, isTKALesson]);


    const currentQuestion = lessonQuestions[currentQuestionIndex];
    const totalQuestions = lessonQuestions.length;
    const isEssayQuestion = currentQuestion?.type === 'essay';
    const isMultipleAnswerQuestion = currentQuestion?.questionType === 'multiple_answer';
    const isTrueFalseQuestion = currentQuestion?.questionType === 'true_false';

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

    const handleEssayChange = (e) => {
        if (isAnswered) return;
        setEssayAnswer(e.target.value);
    };

    // Handler for multiple_answer questions
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

    // Handler for true_false questions
    const handleTrueFalseChange = (statementIndex, value) => {
        if (isAnswered) return;
        setTrueFalseAnswers(prev => ({
            ...prev,
            [statementIndex]: value
        }));
    };

    const handleCheckMultipleChoice = () => {
        if (selectedAnswer === null) return;

        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setScore(prev => prev + 1);
            soundService.playCorrect();
        } else {
            loseHeart();
            setShowShake(true);
            soundService.playWrong();
            setTimeout(() => setShowShake(false), 500);

            // Save wrong answer for review (only MCQ, limit to 50)
            const existingWrongAnswers = userData?.wrongAnswers || [];
            const alreadyExists = existingWrongAnswers.some(
                wa => wa.question === currentQuestion.question
            );

            if (!alreadyExists && existingWrongAnswers.length < 50) {
                const wrongAnswer = {
                    question: currentQuestion.question,
                    options: currentQuestion.options,
                    correctAnswer: currentQuestion.correctAnswer,
                    lessonId: parseInt(lessonId),
                    lessonTitle: lesson?.title || 'Unknown',
                    addedAt: new Date().toISOString()
                };
                updateUserData({
                    wrongAnswers: [...existingWrongAnswers, wrongAnswer]
                });

                // Add to SRS (Spaced Repetition System)
                if (userData?.uid) {
                    addToSRS(userData.uid, {
                        questionId: `${lessonId}_${currentQuestionIndex}`,
                        lessonId: parseInt(lessonId),
                        question: currentQuestion.question,
                        correctAnswer: currentQuestion.correctAnswer,
                        options: currentQuestion.options,
                        type: 'multiple_choice'
                    }).catch(err => console.error('SRS error:', err));
                }
            }
        }
    };

    const handleCheckEssay = async () => {
        if (!essayAnswer.trim() || essayAnswer.trim().length < 5) return;

        setIsGrading(true);
        try {
            const result = await gradeEssayAnswer(
                currentQuestion.question,
                currentQuestion.expectedAnswer,
                essayAnswer,
                getSubjectLabel(lesson?.subject || '')
            );

            setIsCorrect(result.isCorrect);
            setIsPartial(result.isPartial || false);
            setAiFeedback(result.feedback);
            setIsAnswered(true);

            if (result.isCorrect) {
                // Full score for correct answer
                setScore(prev => prev + 1);
                soundService.playCorrect();
            } else if (result.isPartial) {
                // Half score for partial answer
                setScore(prev => prev + 0.5);
                soundService.playCorrect(); // Still plays correct for partial
            } else {
                loseHeart();
                setShowShake(true);
                soundService.playWrong();
                setTimeout(() => setShowShake(false), 500);
            }
        } catch (error) {
            console.error('Grading error:', error);
            setAiFeedback('Terjadi kesalahan saat memeriksa jawaban.');
            setIsAnswered(true);
            setIsCorrect(false);
            setIsPartial(false);
        } finally {
            setIsGrading(false);
        }
    };

    const handleCheck = () => {
        if (isEssayQuestion) {
            handleCheckEssay();
        } else if (isMultipleAnswerQuestion) {
            handleCheckMultipleAnswer();
        } else if (isTrueFalseQuestion) {
            handleCheckTrueFalse();
        } else {
            handleCheckMultipleChoice();
        }
    };

    // Handler for multiple_answer check
    const handleCheckMultipleAnswer = () => {
        if (selectedAnswers.length === 0) return;

        const correctSet = new Set(currentQuestion.correctAnswers);
        const selectedSet = new Set(selectedAnswers);

        let allCorrect = true;
        selectedAnswers.forEach(idx => {
            if (!correctSet.has(idx)) allCorrect = false;
        });
        currentQuestion.correctAnswers.forEach(idx => {
            if (!selectedSet.has(idx)) allCorrect = false;
        });

        setIsCorrect(allCorrect);
        setIsAnswered(true);

        if (allCorrect) {
            setScore(prev => prev + 1);
            soundService.playCorrect();
        } else {
            loseHeart();
            setShowShake(true);
            soundService.playWrong();
            setTimeout(() => setShowShake(false), 500);
        }
    };

    // Handler for true_false check
    const handleCheckTrueFalse = () => {
        if (Object.keys(trueFalseAnswers).length !== currentQuestion.statements.length) return;

        const newResults = {};
        let allCorrect = true;
        currentQuestion.statements.forEach((statement, index) => {
            const userAnswer = trueFalseAnswers[index];
            const isStatementCorrect = userAnswer === statement.correctAnswer;
            newResults[index] = isStatementCorrect;
            if (!isStatementCorrect) allCorrect = false;
        });

        setTrueFalseResults(newResults);
        setIsCorrect(allCorrect);
        setIsAnswered(true);

        if (allCorrect) {
            setScore(prev => prev + 1);
            soundService.playCorrect();
        } else {
            loseHeart();
            setShowShake(true);
            soundService.playWrong();
            setTimeout(() => setShowShake(false), 500);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setSelectedAnswers([]);
            setTrueFalseAnswers({});
            setTrueFalseResults({});
            setEssayAnswer('');
            setIsAnswered(false);
            setIsCorrect(null);
            setAiFeedback('');
            setQuestionKey(prev => prev + 1);
        } else {
            // Lesson completed
            const baseXP = lesson?.xpReward || 50;
            const xpPerQuestion = baseXP / totalQuestions;
            const xpEarned = Math.round(xpPerQuestion * score);

            const percentage = (score / totalQuestions) * 100;
            const passed = percentage >= 50;

            const currentXP = user.xp || 0;
            const currentLevel = user.level || 1;
            const newTotalXP = currentXP + xpEarned;
            const newLevel = Math.floor(newTotalXP / 100) + 1;
            const willLevelUp = passed && newLevel > currentLevel;

            if (passed) {
                addXP(xpEarned);
                completeLesson(lessonId, score, totalQuestions);
            }

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

    const labels = ['A', 'B', 'C', 'D', 'E'];
    const correctAnswerText = isEssayQuestion
        ? currentQuestion.expectedAnswer
        : isTrueFalseQuestion
            ? 'Lihat tabel di atas'
            : isMultipleAnswerQuestion
                ? currentQuestion.correctAnswers?.map(i => currentQuestion.options?.[i]).join(', ')
                : currentQuestion.options?.[currentQuestion.correctAnswer];

    const canCheck = (() => {
        if (isEssayQuestion) return essayAnswer.trim().length >= 5;
        if (isMultipleAnswerQuestion) return selectedAnswers.length > 0;
        if (isTrueFalseQuestion) return Object.keys(trueFalseAnswers).length === currentQuestion.statements?.length;
        return selectedAnswer !== null;
    })();

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

                <HeartDisplay hearts={currentHearts} />
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center w-full max-w-md mx-auto ${isAnswered && !isCorrect ? 'pb-80' : 'pb-36'}`}>
                {/* Question Type Badge */}
                <div className="w-full mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isEssayQuestion ? 'bg-purple-100 text-purple-700' :
                        isMultipleAnswerQuestion ? 'bg-purple-100 text-purple-700' :
                            isTrueFalseQuestion ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                        }`}>
                        <span className="material-symbols-outlined text-sm">
                            {isEssayQuestion ? 'edit_note' :
                                isMultipleAnswerQuestion ? 'check_box' :
                                    isTrueFalseQuestion ? 'fact_check' : 'quiz'}
                        </span>
                        {isEssayQuestion ? 'Isian' :
                            isMultipleAnswerQuestion ? 'Pilihan Ganda (lebih dari satu)' :
                                isTrueFalseQuestion ? `${currentQuestion.optionLabels?.trueLabel || 'Benar'} / ${currentQuestion.optionLabels?.falseLabel || 'Salah'}` :
                                    'Pilihan Ganda'}
                    </span>
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

                {/* Question Section */}
                <div className="w-full mb-6">
                    <h2 className="text-lg font-bold text-text-main mb-4 leading-tight">
                        {isEssayQuestion ? 'Jawablah pertanyaan berikut:' :
                            isMultipleAnswerQuestion ? 'Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.' :
                                isTrueFalseQuestion ? 'Tentukan Benar atau Salah untuk setiap pernyataan.' :
                                    'Pilihlah jawaban yang paling tepat.'}
                    </h2>

                    {/* Question Card */}
                    <div
                        key={`q-${questionKey}`}
                        className="bg-surface rounded-2xl shadow-soft overflow-hidden border border-border mb-6 animate-fadeIn"
                    >
                        <div className="p-5">
                            <p className="text-xl font-bold text-text-main leading-tight">
                                {currentQuestion.question}
                            </p>
                            {/* Question Images - for TKA questions */}
                            {currentQuestion.questionImages && currentQuestion.questionImages.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {currentQuestion.questionImages.map((imgSrc, idx) => (
                                        <img
                                            key={idx}
                                            src={imgSrc}
                                            alt={`Gambar soal ${idx + 1}`}
                                            className="max-w-full max-h-48 rounded-lg border border-border object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Answer Section */}
                {isEssayQuestion ? (
                    /* Essay Input */
                    <div className={`w-full pb-4 ${showShake ? 'animate-shake' : ''}`}>
                        <div className="bg-surface rounded-2xl shadow-soft border border-border p-4">
                            <textarea
                                value={essayAnswer}
                                onChange={handleEssayChange}
                                placeholder="Tuliskan jawabanmu di sini..."
                                disabled={isAnswered || isGrading}
                                maxLength={currentQuestion.maxLength || 300}
                                className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 disabled:text-gray-500 bg-surface text-text-main dark:placeholder-gray-400"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">
                                    {essayAnswer.length}/{currentQuestion.maxLength || 300}
                                </span>
                                {isGrading && (
                                    <span className="text-xs text-primary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                                        AI sedang memeriksa...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : isTrueFalseQuestion ? (
                    /* True/False Table */
                    <div className={`w-full pb-4 ${showShake ? 'animate-shake' : ''}`}>
                        <div className="bg-surface rounded-2xl shadow-soft border border-border overflow-hidden">
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
                            {currentQuestion.statements?.map((statement, index) => (
                                <TrueFalseRow
                                    key={`${questionKey}-${index}`}
                                    statement={statement.text}
                                    value={trueFalseAnswers[index] ?? null}
                                    correct={isAnswered ? trueFalseResults[index] : null}
                                    correctAnswer={statement.correctAnswer}
                                    onChange={(val) => handleTrueFalseChange(index, val)}
                                    disabled={isAnswered}
                                    trueLabel={currentQuestion.optionLabels?.trueLabel || 'Benar'}
                                    falseLabel={currentQuestion.optionLabels?.falseLabel || 'Salah'}
                                />
                            ))}
                        </div>
                        {/* Progress indicator */}
                        {!isAnswered && (
                            <div className="mt-4 text-center">
                                <span className="text-sm text-text-secondary">
                                    {Object.keys(trueFalseAnswers).length} dari {currentQuestion.statements?.length} pernyataan dijawab
                                </span>
                            </div>
                        )}
                    </div>
                ) : isMultipleAnswerQuestion ? (
                    /* Multiple Answer Options */
                    <div
                        key={`opts-${questionKey}`}
                        className={`w-full flex flex-col gap-3 pb-4 stagger-children ${showShake ? 'animate-shake' : ''}`}
                    >
                        {currentQuestion.options?.map((option, index) => {
                            let correctStatus = null;
                            if (isAnswered) {
                                const isInCorrectAnswers = currentQuestion.correctAnswers?.includes(index);
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
                ) : (
                    /* Multiple Choice Options */
                    <div
                        key={`opts-${questionKey}`}
                        className={`w-full flex flex-col gap-3 pb-4 stagger-children ${showShake ? 'animate-shake' : ''}`}
                    >
                        {currentQuestion.options?.map((option, index) => (
                            <OptionCard
                                key={`${questionKey}-${index}`}
                                label={labels[index]}
                                text={option}
                                image={currentQuestion.optionImages?.[index] || null}
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
                                <p className="text-green-700 text-sm">
                                    {aiFeedback || 'Jawaban kamu tepat sekali!'}
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

            {/* Partial or Incorrect Answer - Bottom Sheet */}
            {isAnswered && !isCorrect && (
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-50 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    <div className={`${isPartial ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400' : (isEssayQuestion ? 'bg-red-50 dark:bg-red-900/30 border-red-400' : 'bg-[#fef3eb] dark:bg-orange-900/30 border-[#F4A261]')} border-t-4 p-5 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isPartial ? 'bg-amber-500' : (isEssayQuestion ? 'bg-red-500' : 'bg-[#F4A261]')} text-white shadow-sm shrink-0`}>
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {isPartial ? 'info' : (isEssayQuestion ? 'close' : 'priority_high')}
                                </span>
                            </div>
                            <div>
                                <h3 className={`${isPartial ? 'text-amber-600' : (isEssayQuestion ? 'text-red-600' : 'text-[#c26d2b]')} text-xl font-bold tracking-tight`}>
                                    {isPartial ? 'Jawaban Hampir Benar! 👍' : 'Jawaban Kurang Tepat'}
                                </h3>
                                <p className={`${isPartial ? 'text-amber-700' : (isEssayQuestion ? 'text-red-500' : 'text-[#a67c52]')} text-sm`}>
                                    {aiFeedback || (isPartial ? 'Bagus! Kamu dapat setengah nilai.' : 'Jangan menyerah, tetap semangat! 💪')}
                                </p>
                            </div>
                        </div>

                        {/* Correct Answer Card */}
                        <div className="bg-surface rounded-2xl p-4 border border-border mb-4 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                                Jawaban yang benar:
                            </p>
                            <div className="flex flex-col gap-1">
                                {/* Multiple Choice - single answer */}
                                {!isEssayQuestion && !isMultipleAnswerQuestion && !isTrueFalseQuestion && (
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/20 text-primary font-bold text-sm shrink-0">
                                            {labels[currentQuestion.correctAnswer]}
                                        </div>
                                        <p className="text-primary text-base font-medium leading-relaxed">{correctAnswerText}</p>
                                    </div>
                                )}
                                {/* Essay */}
                                {isEssayQuestion && (
                                    <p className="text-primary text-base font-medium leading-relaxed">{correctAnswerText}</p>
                                )}
                                {/* Multiple Answer - list of correct answers */}
                                {isMultipleAnswerQuestion && currentQuestion.correctAnswers?.map((idx, i) => (
                                    <p key={i} className="text-primary text-sm font-medium leading-relaxed flex items-start gap-2">
                                        <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        {currentQuestion.options?.[idx]}
                                    </p>
                                ))}
                                {/* True/False - list with Benar/Salah labels */}
                                {isTrueFalseQuestion && currentQuestion.statements?.map((statement, i) => (
                                    <p key={i} className="text-primary text-sm font-medium leading-relaxed flex items-start gap-2">
                                        <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        <span>
                                            <span className="font-bold">{statement.correctAnswer ? (currentQuestion.optionLabels?.trueLabel || 'Benar') : (currentQuestion.optionLabels?.falseLabel || 'Salah')}</span>
                                            {' - '}
                                            {statement.text.length > 50 ? statement.text.substring(0, 50) + '...' : statement.text}
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
                            disabled={!canCheck || isGrading}
                        >
                            {isGrading ? (
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                                    MEMERIKSA...
                                </span>
                            ) : (
                                'PERIKSA'
                            )}
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
