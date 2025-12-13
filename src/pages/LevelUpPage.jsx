import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

function LevelUpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        newLevel = 2,
        xpEarned = 0,
        score = 0,
        totalQuestions = 5,
        passed = true,
        lessonId = null
    } = location.state || {};

    const [showStars, setShowStars] = useState(false);
    const [showLevel, setShowLevel] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showButton, setShowButton] = useState(false);

    // Staggered animation sequence
    useEffect(() => {
        const timers = [
            setTimeout(() => setShowStars(true), 300),
            setTimeout(() => setShowLevel(true), 800),
            setTimeout(() => setShowText(true), 1500),
            setTimeout(() => setShowButton(true), 2200),
        ];
        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    const handleContinue = () => {
        navigate('/win', {
            state: {
                xpEarned,
                score,
                totalQuestions,
                passed,
                lessonId
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/20 via-background to-background flex flex-col items-center justify-center px-6 overflow-hidden relative">

            {/* Particle Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {showStars && [...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        <span
                            className="material-symbols-outlined text-yellow-400"
                            style={{
                                fontSize: `${12 + Math.random() * 20}px`,
                                opacity: 0.6 + Math.random() * 0.4,
                                fontVariationSettings: "'FILL' 1"
                            }}
                        >
                            star
                        </span>
                    </div>
                ))}
            </div>

            {/* Rising Particles */}
            {showStars && [...Array(15)].map((_, i) => (
                <div
                    key={`rise-${i}`}
                    className="absolute bottom-0 w-2 h-2 rounded-full"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        backgroundColor: ['#36e270', '#FFD700', '#BFD7EA', '#F4A261'][i % 4],
                        animation: `riseUp ${2 + Math.random() * 2}s ease-out forwards`,
                        animationDelay: `${Math.random() * 1}s`,
                    }}
                />
            ))}

            <div className="max-w-sm w-full text-center relative z-10">

                {/* Level Badge - Main Focus */}
                <div className={`transition-all duration-1000 ${showLevel ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-48 h-48 rounded-full bg-primary/30 blur-3xl animate-pulse-slow"
                            style={{ animationDuration: '2s' }}
                        />
                    </div>

                    {/* Level Circle */}
                    <div className="relative mb-6">
                        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-600 shadow-2xl shadow-primary/50 animate-bounceIn">
                            {/* Inner Circle */}
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30">
                                <div className="text-center">
                                    <span className="text-white text-sm font-medium opacity-80">LEVEL</span>
                                    <div className="text-white text-5xl font-black leading-none">{newLevel}</div>
                                </div>
                            </div>
                        </div>

                        {/* Crown */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounceIn" style={{ animationDelay: '0.3s' }}>
                            <span
                                className="material-symbols-outlined text-yellow-400 drop-shadow-lg"
                                style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
                            >
                                auto_awesome
                            </span>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className={`transition-all duration-700 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className="text-3xl font-extrabold text-text-main mb-2">
                        Naik Level!
                    </h1>
                    <p className="text-text-secondary text-lg mb-2">
                        Selamat! Kamu sekarang di
                    </p>
                    <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                            workspace_premium
                        </span>
                        <span className="text-primary font-bold text-lg">Level {newLevel}</span>
                    </div>

                    {/* Motivational Message */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200 mb-6">
                        <p className="text-yellow-800 font-medium">
                            {newLevel === 2 && "Awal yang hebat! Terus semangat! 💪"}
                            {newLevel === 3 && "Keren! Kamu semakin pintar! 🌟"}
                            {newLevel === 4 && "Luar biasa! Hampir jadi master! 🚀"}
                            {newLevel >= 5 && "WOW! Kamu adalah bintang! ⭐"}
                        </p>
                    </div>
                </div>

                {/* Continue Button */}
                <div className={`transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleContinue}
                    >
                        <span>Lanjutkan</span>
                        <span className="material-symbols-outlined ml-2">arrow_forward</span>
                    </Button>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes riseUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}

export default LevelUpPage;
