import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

function WinPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        xpEarned = 0,
        score = 0,
        totalQuestions = 5,
        passed = true,
        lessonId = null
    } = location.state || {};

    const [showConfetti, setShowConfetti] = useState(passed);
    const percentage = Math.round((score / totalQuestions) * 100);

    // Hide confetti after animation
    useEffect(() => {
        if (passed) {
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [passed]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden relative">

            {/* Confetti Particles - only show if passed */}
            {showConfetti && passed && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 rounded-sm"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-20px',
                                backgroundColor: ['#36e270', '#F4A261', '#BFD7EA', '#FFD700', '#FF6B6B'][i % 5],
                                animation: `confettiFall ${2 + Math.random() * 2}s ease-out forwards`,
                                animationDelay: `${Math.random() * 0.5}s`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="max-w-sm w-full text-center relative z-10">
                {/* Mascot Image */}
                <div className="mb-6 animate-bounceIn" style={{ animationDelay: '0.1s' }}>
                    <img
                        src={passed ? '/Assets/Win.png' : '/Assets/Salah.png'}
                        alt={passed ? 'Win Mascot' : 'Try Again Mascot'}
                        className="w-40 h-40 mx-auto object-contain drop-shadow-lg"
                    />
                </div>

                {/* Title */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
                    <h1 className="text-3xl font-extrabold text-text-main mb-2">
                        {passed ? 'Hebat! 🎉' : 'Hampir! 💪'}
                    </h1>
                    <p className="text-text-secondary text-lg mb-8">
                        {passed
                            ? 'Kamu berhasil menyelesaikan pelajaran ini!'
                            : 'Kamu perlu minimal 50% benar untuk lulus'
                        }
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div
                        className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 animate-fadeInUp hover-lift"
                        style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
                    >
                        <div className={`text-3xl font-bold mb-1 ${passed ? 'text-primary' : 'text-gray-400'}`}>
                            {passed ? `+${xpEarned}` : '0'}
                        </div>
                        <div className="text-sm text-text-secondary">XP Diperoleh</div>
                    </div>
                    <div
                        className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 animate-fadeInUp hover-lift"
                        style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
                    >
                        <div className={`text-3xl font-bold mb-1 ${percentage >= 80 ? 'text-primary' :
                            percentage >= 50 ? 'text-blue-600' : 'text-orange-500'
                            }`}>
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-sm text-text-secondary">Jawaban Benar</div>
                    </div>
                </div>

                {/* Percentage Badge */}
                <div
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 animate-fadeInUp ${percentage >= 80 ? 'bg-primary/20 text-green-800' :
                        percentage >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }`}
                    style={{ animationDelay: '0.65s', opacity: 0, animationFillMode: 'forwards' }}
                >
                    <span className="font-bold">{percentage}%</span>
                    <span className="text-sm">
                        {percentage >= 80 ? 'Luar Biasa!' : percentage >= 50 ? 'Bagus!' : 'Perlu Latihan'}
                    </span>
                </div>

                {/* Encouraging Message */}
                <div
                    className={`rounded-xl p-4 mb-8 animate-fadeInUp ${passed ? 'bg-soft-green/30' : 'bg-orange-50'
                        }`}
                    style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}
                >
                    <p className={passed ? 'text-green-800 font-medium' : 'text-orange-800 font-medium'}>
                        {passed
                            ? score === totalQuestions
                                ? "Sempurna! Kamu menjawab semua dengan benar! 🌟"
                                : score >= totalQuestions * 0.8
                                    ? "Bagus sekali! Terus pertahankan! 💪"
                                    : "Kerja bagus! Terus tingkatkan kemampuanmu! 📚"
                            : "Jangan menyerah! Coba lagi untuk hasil lebih baik! 📚"
                        }
                    </p>
                </div>

                {/* Actions */}
                <div
                    className="flex flex-col gap-3 animate-fadeInUp"
                    style={{ animationDelay: '0.9s', opacity: 0, animationFillMode: 'forwards' }}
                >
                    {passed ? (
                        <>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => navigate('/levels')}
                            >
                                Pelajaran Berikutnya
                            </Button>
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate('/home')}
                            >
                                Kembali ke Beranda
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => navigate(`/lesson/${lessonId}`)}
                            >
                                <span className="material-symbols-outlined mr-2">refresh</span>
                                Coba Lagi
                            </Button>
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate('/levels')}
                            >
                                Pilih Pelajaran Lain
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* CSS for confetti */}
            <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}

export default WinPage;
