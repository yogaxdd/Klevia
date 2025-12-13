import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

function ProfileSetupPage() {
    const navigate = useNavigate();
    const { currentUser, userData, updateUserData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: currentUser?.displayName || userData?.displayName || '',
        gender: userData?.gender || '',
        birthDate: userData?.birthDate || '',
    });

    const handleSubmit = async () => {
        if (!formData.displayName.trim()) {
            alert('Nama tidak boleh kosong');
            return;
        }

        setIsLoading(true);

        await updateUserData({
            displayName: formData.displayName,
            gender: formData.gender,
            birthDate: formData.birthDate,
            profileCompleted: true,
        });

        setIsLoading(false);
        navigate('/select-class');
    };

    const handleSkip = async () => {
        // Still mark profile as completed but with default values
        await updateUserData({
            profileCompleted: true,
        });
        navigate('/select-class');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="text-center mb-8">
                    {/* Avatar from Google */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
                        {currentUser?.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>
                                    person
                                </span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-text-main mb-1">Lengkapi Profilmu</h1>
                    <p className="text-text-secondary">Hai {currentUser?.displayName?.split(' ')[0] || 'teman'}! 👋</p>
                </div>

                {/* Form */}
                <Card className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            placeholder="Masukkan nama lengkap"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-text-main"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Jenis Kelamin
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'male', label: 'Laki-laki', icon: 'male' },
                                { value: 'female', label: 'Perempuan', icon: 'female' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setFormData({ ...formData, gender: option.value })}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.gender === option.value
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 text-text-secondary hover:border-gray-300'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{option.icon}</span>
                                    <span className="font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-text-main"
                        />
                    </div>
                </Card>

                {/* Submit Button */}
                <div className="mt-6">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                Menyimpan...
                            </>
                        ) : (
                            'Lanjutkan'
                        )}
                    </Button>

                    <button
                        onClick={handleSkip}
                        className="w-full mt-3 text-sm text-text-secondary hover:text-text-main transition-colors"
                    >
                        Lewati untuk sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileSetupPage;
