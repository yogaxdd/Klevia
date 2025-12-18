import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiSelectOptionCard from '../components/MultiSelectOptionCard';
import ProgressBar from '../components/ProgressBar';
import HeartDisplay from '../components/HeartDisplay';
import Button from '../components/Button';

// Sample questions with multiple correct answers
const sampleQuestions = [
    {
        id: 1,
        readingPassage: `Lautan mengalami ancaman pemanasan dan menjadi semakin asam karena kita terus memompa lebih banyak CO₂ ke atmosfer. Selain itu, lautan juga menghadapi ancaman lain dari manusia, yakni penggunaan plastik. Kehidupan modern saat ini didominasi oleh kemasan makanan berbahan plastik yang diolah dengan teknologi tinggi dan digunakan setiap hari oleh masyarakat. Dalam sebuah laporan telah disebutkan bahwa pada tahun 2050 sampah plastik di laut akan lebih banyak daripada jumlah ikan apabila kecenderungan ini terus berlanjut. Hal tersebut merupakan sebuah ancaman besar.

Dibutuhkan tindakan skala besar untuk berpindah dari kecenderungan tersebut mengingat banyak pihak yang terlibat dalam bidang pekerjaan ini. Masyarakat sektor swasta dan masyarakat sipil perlu mobilisasi untuk menangkap peluang ekonomi lain di luar dari pengelolaan plastik.

Solusi tersebut tidak mudah. Fakta bahwa harga minyak yang rendah mengakibatkan biaya yang dibutuhkan untuk daur ulang plastik jauh lebih mahal daripada memproduksi yang baru. Kondisi lain yang menunjukkan ekonomi di negara berkembang tumbuh lebih besar menjadikan penggunaan plastik juga meningkat. Solusi yang dibutuhkan adalah cara kita menggunakan plastik. Misalnya dengan mengurangi penggunaan plastik dalam kemasan atau menggunakannya kembali sebanyak yang kita bisa.`,
        question: "Mengapa lautan menghadapi ancaman pada 2050?",
        options: [
            "Sampah plastik di laut akan lebih banyak daripada jumlah ikan.",
            "Lautan akan terus mengalami pemanasan dan semakin asam.",
            "Manusia terus memompa lebih banyak CO₂ ke atmosfer.",
            "Jumlah ikan yang terancam punah semakin banyak.",
            "Penggunaan plastik terus meningkat dan tidak dikelola dengan baik"
        ],
        correctAnswers: [0, 1, 2, 4],
    },
    {
        id: 2,
        readingPassage: `Pemanasan global adalah fenomena meningkatnya suhu rata-rata atmosfer, laut, dan daratan bumi. Penyebab utama pemanasan global adalah meningkatnya konsentrasi gas rumah kaca di atmosfer akibat aktivitas manusia.

Gas rumah kaca utama meliputi karbon dioksida (CO₂), metana (CH₄), dan dinitrogen oksida (N₂O). Pembakaran bahan bakar fosil dan deforestasi adalah kontributor utama emisi CO₂. Sektor pertanian dan peternakan menghasilkan metana dalam jumlah besar.

Dampak pemanasan global meliputi mencairnya es di kutub, naiknya permukaan air laut, perubahan pola cuaca, dan kepunahan spesies. Para ilmuwan sepakat bahwa tindakan segera diperlukan untuk mengurangi emisi gas rumah kaca.`,
        question: "Berdasarkan teks di atas, apa saja penyebab utama pemanasan global?",
        options: [
            "Pembakaran bahan bakar fosil",
            "Deforestasi atau penebangan hutan",
            "Aktivitas pertanian dan peternakan",
            "Naiknya permukaan air laut",
            "Mencairnya es di kutub"
        ],
        correctAnswers: [0, 1, 2],
    },
    {
        id: 3,
        readingPassage: null,
        question: "Manakah yang termasuk bilangan prima?",
        options: [
            "2",
            "3",
            "4",
            "5",
            "9"
        ],
        correctAnswers: [0, 1, 3],
    }
];

function MultiAnswerTestPage() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hearts, setHearts] = useState(5);
    const [score, setScore] = useState(0);
    const [showShake, setShowShake] = useState(false);
    const [questionKey, setQuestionKey] = useState(0);

    const currentQuestion = sampleQuestions[currentQuestionIndex];
    const totalQuestions = sampleQuestions.length;

    const handleToggleAnswer = (index) => {
        if (isAnswered) return;

        setSelectedAnswers(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleCheck = () => {
        if (selectedAnswers.length === 0) return;

        const correctSet = new Set(currentQuestion.correctAnswers);
        const selectedSet = new Set(selectedAnswers);

        // Check if all correct answers are selected and no wrong answers
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
        } else {
            setHearts(prev => Math.max(0, prev - 1));
            setShowShake(true);
            setTimeout(() => setShowShake(false), 500);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswers([]);
            setIsAnswered(false);
            setIsCorrect(null);
            setQuestionKey(prev => prev + 1);
        } else {
            navigate('/home');
        }
    };

    const handleClose = () => {
        navigate('/home');
    };

    const getOptionState = (index) => {
        if (!isAnswered) return null;

        const isSelected = selectedAnswers.includes(index);
        const isCorrectAnswer = currentQuestion.correctAnswers.includes(index);

        if (isSelected && isCorrectAnswer) return true;
        if (isSelected && !isCorrectAnswer) return false;
        if (!isSelected && isCorrectAnswer) return 'missed';
        return null;
    };

    const canCheck = selectedAnswers.length > 0;

    // Get correct answers text for display
    const correctAnswersText = currentQuestion.correctAnswers
        .map(idx => currentQuestion.options[idx])
        .join(', ');

    return (
        <div className="bg-background min-h-screen flex flex-col relative">
            {/* Top Bar - Same as LessonPage */}
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
            <div className={`flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col items-center w-full max-w-md mx-auto ${isAnswered && !isCorrect ? 'pb-72' : 'pb-28'}`}>
                {/* Question Type Badge */}
                <div className="w-full mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <span className="material-symbols-outlined text-sm">checklist</span>
                        Pilihan Ganda (Lebih dari 1)
                    </span>
                </div>

                {/* Question Section */}
                <div className="w-full mb-6">
                    <h2 className="text-lg font-bold text-text-main mb-4 leading-tight">
                        Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.
                    </h2>

                    {/* Reading Passage (if exists) */}
                    {currentQuestion.readingPassage && (
                        <div
                            key={`passage-${questionKey}`}
                            className="bg-surface rounded-2xl shadow-soft overflow-hidden border border-border mb-4 animate-fadeIn"
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
                        className="bg-surface rounded-2xl shadow-soft overflow-hidden border border-border mb-6 animate-fadeIn"
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
                    {currentQuestion.options.map((option, index) => (
                        <MultiSelectOptionCard
                            key={`${questionKey}-${index}`}
                            text={option}
                            selected={selectedAnswers.includes(index)}
                            correct={getOptionState(index)}
                            onClick={() => handleToggleAnswer(index)}
                            disabled={isAnswered}
                        />
                    ))}
                </div>
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
                                    Kamu berhasil memilih semua jawaban yang benar!
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
                                {currentQuestion.correctAnswers.map((idx, i) => (
                                    <p key={i} className="text-primary text-sm font-medium leading-relaxed flex items-start gap-2">
                                        <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        {currentQuestion.options[idx]}
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
                            disabled={!canCheck}
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

export default MultiAnswerTestPage;
