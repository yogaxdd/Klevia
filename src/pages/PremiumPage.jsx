import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';

function PremiumPage() {
    const navigate = useNavigate();
    const { user, streak, activatePremium } = useApp();
    const [selectedPlan, setSelectedPlan] = useState('yearly');
    const [showSuccess, setShowSuccess] = useState(false);

    const isPremium = user.isPremium && new Date(user.premiumExpiry) > new Date();

    // Calculate days remaining
    const getDaysRemaining = () => {
        if (!user.premiumExpiry) return 0;
        const expiry = new Date(user.premiumExpiry);
        const now = new Date();
        const diff = expiry - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const plans = [
        {
            id: 'monthly',
            name: 'Bulanan',
            price: 0,
            priceDisplay: 'Rp 0',
            period: '/bulan',
            savings: null,
        },
        {
            id: 'yearly',
            name: 'Tahunan',
            price: 0,
            priceDisplay: 'Rp 0',
            period: '/tahun',
            savings: 'Hemat 100%',
            monthly: 'Rp 0/bulan',
            popular: true,
        },
    ];

    const benefits = [
        { icon: 'favorite', title: 'Unlimited Hearts', desc: 'Belajar tanpa batas', active: isPremium },
        { icon: 'bolt', title: '2x XP Boost', desc: 'Naik level lebih cepat', active: isPremium },
        { icon: 'local_fire_department', title: 'Streak Protection', desc: '1x freeze per hari', active: isPremium },
        { icon: 'workspace_premium', title: 'Premium Badge', desc: 'Tampil eksklusif', active: isPremium },
        { icon: 'block', title: 'Bebas Iklan', desc: 'Fokus belajar tanpa gangguan', active: isPremium },
        { icon: 'analytics', title: 'Statistik Lengkap', desc: 'Pantau progressmu', active: isPremium },
    ];

    const handleSubscribe = () => {
        activatePremium(selectedPlan);
        setShowSuccess(true);

        setTimeout(() => {
            navigate('/home');
        }, 2000);
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex flex-col items-center justify-center px-6">
                <div className="animate-bounceIn text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg">
                        <span
                            className="material-symbols-outlined text-white"
                            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
                        >
                            check_circle
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main mb-2">
                        Selamat! 🎉
                    </h1>
                    <p className="text-text-secondary">
                        Kamu sekarang Premium Member!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background pb-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 px-6 pt-8 pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-text-main">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold text-text-main">KLEVIA Premium</h1>
                </header>

                {/* Hero - Different for Premium vs Non-Premium */}
                <div className="px-6 py-6 text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${isPremium
                            ? 'bg-gradient-to-br from-primary to-green-600'
                            : 'bg-gradient-to-br from-primary/50 to-green-600/50'
                        }`}>
                        <span
                            className="material-symbols-outlined text-white"
                            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
                        >
                            {isPremium ? 'verified' : 'workspace_premium'}
                        </span>
                    </div>

                    {isPremium ? (
                        <>
                            <div className="inline-flex items-center gap-1 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    check_circle
                                </span>
                                AKTIF
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-1">
                                Premium Member
                            </h2>
                            <p className="text-text-secondary">
                                Terima kasih sudah berlangganan!
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-text-main mb-2">
                                Upgrade ke Premium
                            </h2>
                            <p className="text-text-secondary">
                                Belajar lebih efektif dengan fitur eksklusif
                            </p>
                        </>
                    )}
                </div>

                {/* Premium Status Card - Only for Premium Users */}
                {isPremium && (
                    <div className="px-6 mb-6">
                        <Card className="bg-gradient-to-br from-primary/10 to-green-50 border border-primary/20">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-text-main">Status Langganan</h3>
                                    <p className="text-sm text-text-secondary">Detail subscriptionmu</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        calendar_month
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-text-secondary text-sm">Berakhir pada</span>
                                    <span className="font-bold text-text-main">{formatDate(user.premiumExpiry)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-text-secondary text-sm">Sisa waktu</span>
                                    <span className="font-bold text-primary">{getDaysRemaining()} hari</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-text-secondary text-sm">Streak Freeze</span>
                                    <span className={`font-bold ${streak.streakFreezeUsed ? 'text-gray-400' : 'text-primary'}`}>
                                        {streak.streakFreezeUsed ? 'Sudah digunakan hari ini' : 'Tersedia'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Benefits */}
                <div className="px-6 mb-6">
                    <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">
                        {isPremium ? 'Keuntunganmu' : 'Keuntungan Premium'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {benefits.map((benefit, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl p-4 shadow-sm border ${benefit.active
                                        ? 'bg-primary/5 border-primary/20'
                                        : 'bg-white border-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${benefit.active ? 'bg-primary/20' : 'bg-gray-100'
                                        }`}>
                                        <span
                                            className={`material-symbols-outlined ${benefit.active ? 'text-primary' : 'text-gray-400'
                                                }`}
                                            style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                                        >
                                            {benefit.icon}
                                        </span>
                                    </div>
                                    {benefit.active && (
                                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                                <h4 className={`font-bold text-sm ${benefit.active ? 'text-text-main' : 'text-gray-400'}`}>
                                    {benefit.title}
                                </h4>
                                <p className={`text-xs ${benefit.active ? 'text-text-secondary' : 'text-gray-300'}`}>
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Cards - Only show if not premium */}
                {!isPremium && (
                    <div className="px-6 mb-6">
                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">
                            Pilih Paket
                        </h3>
                        <div className="space-y-3">
                            {plans.map((plan) => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`w-full p-4 pl-14 rounded-2xl border-2 transition-all text-left relative ${selectedPlan === plan.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    {plan.popular && (
                                        <span className="absolute -top-2 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                                            POPULER
                                        </span>
                                    )}

                                    {/* Radio indicator */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id
                                            ? 'border-primary bg-primary'
                                            : 'border-gray-300 bg-white'
                                        }`}>
                                        {selectedPlan === plan.id && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-text-main">{plan.name}</h4>
                                            {plan.monthly && (
                                                <p className="text-xs text-text-secondary">{plan.monthly}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-text-main">{plan.priceDisplay}</div>
                                            <div className="text-xs text-text-secondary">{plan.period}</div>
                                        </div>
                                    </div>

                                    {plan.savings && (
                                        <span className="inline-block mt-2 bg-primary/20 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                            {plan.savings}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="px-6">
                    {isPremium ? (
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={() => navigate('/home')}
                            >
                                Lanjut Belajar
                            </Button>
                            <p className="text-xs text-center text-text-secondary">
                                Butuh bantuan? Hubungi support@klevia.id
                            </p>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={handleSubscribe}
                            >
                                <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    workspace_premium
                                </span>
                                Uji Coba Gratis!
                            </Button>
                            <p className="text-xs text-center text-text-secondary mt-3">
                                Pembayaran akan diproses setelah konfirmasi.
                                <br />Bisa dibatalkan kapan saja.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PremiumPage;
