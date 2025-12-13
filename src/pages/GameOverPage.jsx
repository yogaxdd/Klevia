import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function GameOverPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
            <div className="max-w-sm w-full text-center">
                {/* Mascot Image */}
                <div className="mb-6 animate-bounceIn" style={{ animationDelay: '0.1s' }}>
                    <img
                        src="/src/Assets/Salah.png"
                        alt="Game Over Mascot"
                        className="w-40 h-40 mx-auto object-contain drop-shadow-lg"
                    />
                </div>

                {/* Title */}
                <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
                >
                    <h1 className="text-3xl font-extrabold text-text-main mb-2">
                        Nyawa Habis
                    </h1>
                    <p className="text-text-secondary text-lg mb-8">
                        Jangan menyerah! Kamu bisa mencoba lagi.
                    </p>
                </div>

                {/* Encouraging Message */}
                <div
                    className="bg-orange-50 rounded-xl p-4 mb-8 animate-fadeInUp"
                    style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}
                >
                    <p className="text-orange-800 font-medium">
                        💡 Tips: Baca pertanyaan dengan teliti sebelum menjawab. Kamu pasti bisa!
                    </p>
                </div>

                {/* Actions */}
                <div
                    className="flex flex-col gap-3 animate-fadeInUp"
                    style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}
                >
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => navigate(-1)}
                    >
                        <span className="material-symbols-outlined mr-2">refresh</span>
                        Coba Lagi
                    </Button>
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/levels')}
                    >
                        Pilih Pelajaran Lain
                    </Button>
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => navigate('/home')}
                    >
                        Kembali ke Beranda
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default GameOverPage;

