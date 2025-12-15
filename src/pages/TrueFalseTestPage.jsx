import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

// Sample true/false question from Pusmendik
const sampleQuestions = [
    {
        id: 1,
        context: "Apabila Mirna ingin memperoleh keuntungan maksimum, tentukan Benar atau Salah untuk setiap pernyataan berikut!",
        statements: [
            { text: "Mirna harus memproduksi 200 kotak kue bolu.", correct: true },
            { text: "Mirna harus memproduksi kue brownies lebih banyak.", correct: false },
            { text: "Keuntungan maksimum yang dapat diperoleh Mirna adalah Rp3.100.000,00.", correct: true }
        ],
        images: []
    },
    {
        id: 2,
        context: "Tentukan Benar atau Salah untuk setiap pernyataan berikut terkait dengan besar sudut pada trapesium ABCD!",
        statements: [
            { text: "∠DAB = 60°", correct: true, image: "/downloaded_images/65502_3a1a1a2f9ce77db7f1cac78b777aeac3.png" },
            { text: "∠ABC = 120°", correct: false, image: "/downloaded_images/65502_288dbf2e00b1bddebeddf4aa378cf706.png" },
            { text: "∠BCD = 60°", correct: true, image: "/downloaded_images/65502_9f675a63ab39ad85502209c54a02a18f.png" }
        ],
        images: ["/downloaded_images/65502_c1f1ffe270f76a3a1535bde803228b4d.png"]
    },
    {
        id: 3,
        context: "Tentukan Benar atau Salah pada setiap pernyataan berikut yang terkait dengan grafik fungsi!",
        statements: [
            { text: "Grafik fungsi ƒ terbuka ke atas.", correct: true },
            { text: "Grafik fungsi ƒ memotong garis y = x", correct: false },
            { text: "Grafik fungsi ƒ tidak melalui kuadran tiga.", correct: true }
        ],
        images: ["/downloaded_images/58301_e1f215c43d145ce6d57d8f93cf319473.png"]
    }
];

function TrueFalseTestPage() {
    const navigate = useNavigate();
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    const question = sampleQuestions[currentQ];

    const handleAnswer = (statementIndex, answer) => {
        if (showResult) return;
        setAnswers(prev => ({
            ...prev,
            [`${currentQ}-${statementIndex}`]: answer
        }));
    };

    const handleCheck = () => {
        setShowResult(true);
    };

    const handleNext = () => {
        if (currentQ < sampleQuestions.length - 1) {
            setCurrentQ(prev => prev + 1);
            setShowResult(false);
        }
    };

    const handlePrev = () => {
        if (currentQ > 0) {
            setCurrentQ(prev => prev - 1);
            setShowResult(false);
        }
    };

    const allAnswered = question.statements.every((_, idx) =>
        answers[`${currentQ}-${idx}`] !== undefined
    );

    const getScore = () => {
        let correct = 0;
        question.statements.forEach((stmt, idx) => {
            if (answers[`${currentQ}-${idx}`] === stmt.correct) correct++;
        });
        return correct;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-text-secondary hover:text-text-main"
                    >
                        <span className="material-symbols-outlined mr-1">arrow_back</span>
                        Kembali
                    </button>
                    <div className="text-sm text-text-secondary">
                        Soal {currentQ + 1} dari {sampleQuestions.length}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-text-main mb-2">
                    Soal Benar/Salah (True/False)
                </h1>
                <p className="text-text-secondary mb-6">
                    Prototype UI untuk tipe soal true_false dari TKA Pusmendik
                </p>

                {/* Question Card */}
                <div className="bg-surface rounded-2xl shadow-soft border border-border p-6 mb-6">
                    {/* Context/Instructions */}
                    <p className="text-lg font-semibold text-text-main mb-4">
                        {question.context}
                    </p>

                    {/* Question Images */}
                    {question.images.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            {question.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Gambar konteks ${idx + 1}`}
                                    className="max-h-40 rounded-lg border border-border"
                                />
                            ))}
                        </div>
                    )}

                    {/* Statements */}
                    <div className="space-y-4">
                        {question.statements.map((statement, idx) => {
                            const userAnswer = answers[`${currentQ}-${idx}`];
                            const isCorrect = showResult && userAnswer === statement.correct;
                            const isWrong = showResult && userAnswer !== statement.correct && userAnswer !== undefined;

                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-xl border-2 transition-all ${showResult
                                            ? isCorrect
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                : isWrong
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                                        }`}
                                >
                                    {/* Statement text or image */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="font-bold text-primary shrink-0">{idx + 1}.</span>
                                        <div className="flex-1">
                                            {statement.image ? (
                                                <img
                                                    src={statement.image}
                                                    alt={`Pernyataan ${idx + 1}`}
                                                    className="max-h-12 rounded border border-border"
                                                />
                                            ) : (
                                                <p className="text-text-main">{statement.text}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* True/False buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAnswer(idx, true)}
                                            disabled={showResult}
                                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${userAnswer === true
                                                    ? showResult
                                                        ? statement.correct
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-red-500 text-white'
                                                        : 'bg-primary text-white'
                                                    : 'bg-white dark:bg-gray-700 text-text-main border-2 border-gray-200 dark:border-gray-600 hover:border-primary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                            Benar
                                        </button>
                                        <button
                                            onClick={() => handleAnswer(idx, false)}
                                            disabled={showResult}
                                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${userAnswer === false
                                                    ? showResult
                                                        ? !statement.correct
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-red-500 text-white'
                                                        : 'bg-primary text-white'
                                                    : 'bg-white dark:bg-gray-700 text-text-main border-2 border-gray-200 dark:border-gray-600 hover:border-primary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">cancel</span>
                                            Salah
                                        </button>
                                    </div>

                                    {/* Show correct answer after check */}
                                    {showResult && (
                                        <div className={`mt-3 p-2 rounded-lg text-sm ${isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' :
                                                'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
                                            }`}>
                                            {isCorrect ? (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                    Jawaban benar!
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                    Jawaban salah. Yang benar: <strong>{statement.correct ? 'Benar' : 'Salah'}</strong>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Result Summary */}
                {showResult && (
                    <div className="bg-primary/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-secondary">Skor kamu</p>
                            <p className="text-2xl font-bold text-primary">
                                {getScore()}/{question.statements.length} Benar
                            </p>
                        </div>
                        <div className="text-4xl">
                            {getScore() === question.statements.length ? '🎉' : getScore() >= question.statements.length / 2 ? '👍' : '💪'}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {currentQ > 0 && (
                        <Button variant="outline" onClick={handlePrev} className="flex-1">
                            Sebelumnya
                        </Button>
                    )}
                    {!showResult ? (
                        <Button
                            variant="primary"
                            onClick={handleCheck}
                            disabled={!allAnswered}
                            className="flex-1"
                        >
                            Periksa Jawaban
                        </Button>
                    ) : currentQ < sampleQuestions.length - 1 ? (
                        <Button variant="primary" onClick={handleNext} className="flex-1">
                            Selanjutnya
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => navigate(-1)} className="flex-1">
                            Selesai
                        </Button>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined">info</span>
                        Tentang Tipe Soal Ini
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        Tipe soal <strong>true_false</strong> dari Pusmendik berisi beberapa pernyataan yang harus ditentukan Benar atau Salah.
                        Setiap pernyataan dinilai secara independen. Soal ini berbeda dari pilihan ganda karena bisa terdapat lebih dari satu jawaban benar.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TrueFalseTestPage;
