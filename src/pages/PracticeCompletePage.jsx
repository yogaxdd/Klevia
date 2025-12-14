import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

function PracticeCompletePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { score = 0, totalQuestions = 5, lessonTitle = 'Latihan' } = location.state || {};

    const percentage = Math.round((score / totalQuestions) * 100);
    const isPerfect = score === totalQuestions;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex flex-col items-center justify-center px-6">
            <div className="max-w-sm w-full text-center">
                {/* Icon */}
                <div className="mb-6 animate-bounceIn">
                    <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-blue-600"
                            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
                        >
                            {isPerfect ? 'emoji_events' : 'fitness_center'}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-text-main mb-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    {isPerfect ? 'Sempurna!' : 'Latihan Selesai!'}
                </h1>

                <p className="text-text-secondary mb-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    {lessonTitle}
                </p>

                {/* Score Card */}
                <Card className="mb-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="text-center py-4">
                        <p className="text-sm text-text-secondary mb-2">Skor Latihan</p>
                        <p className="text-5xl font-bold text-blue-600 mb-2">{score}/{totalQuestions}</p>
                        <p className={`text-sm font-medium ${percentage >= 80 ? 'text-green-600' :
                                percentage >= 50 ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                            {percentage}% benar
                        </p>
                    </div>
                </Card>

                {/* Info */}
                <div className="bg-blue-50 rounded-2xl p-4 mb-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-600">info</span>
                        <p className="text-sm text-blue-700 text-left">
                            Mode latihan tidak mempengaruhi XP atau nyawa. Terus berlatih!
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate(-1)}
                    >
                        Latihan Lagi
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

export default PracticeCompletePage;
