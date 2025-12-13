import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';

function ClassSelectionPage() {
    const navigate = useNavigate();
    const { user, updateUser } = useApp();

    const classes = [
        { id: 7, label: 'Kelas 7', description: 'SMP Kelas VII' },
        { id: 8, label: 'Kelas 8', description: 'SMP Kelas VIII' },
        { id: 9, label: 'Kelas 9', description: 'SMP Kelas IX' },
    ];

    const handleSelectClass = (kelasId) => {
        updateUser({ kelas: kelasId });
        navigate('/select-subject');
    };

    return (
        <div className="min-h-screen flex flex-col px-6 py-10 max-w-md mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-text-secondary hover:text-text-main mb-6"
                >
                    <span className="material-symbols-outlined mr-1">arrow_back</span>
                    Kembali
                </button>

                <h1 className="text-2xl font-bold text-text-main mb-2">
                    Pilih Kelasmu
                </h1>
                <p className="text-text-secondary">
                    Materi akan disesuaikan dengan tingkat kelasmu
                </p>
            </div>

            {/* Class Options */}
            <div className="flex flex-col gap-4 flex-1">
                {classes.map((kelas) => (
                    <Card
                        key={kelas.id}
                        hoverable
                        onClick={() => handleSelectClass(kelas.id)}
                        className={`${user.kelas === kelas.id ? 'ring-2 ring-primary border-primary' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                <span className="text-2xl font-bold text-primary">{kelas.id}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-text-main text-lg">{kelas.label}</h3>
                                <p className="text-sm text-text-secondary">{kelas.description}</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300">
                                chevron_right
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Continue Button */}
            {user.kelas && (
                <div className="mt-6">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => navigate('/select-subject')}
                    >
                        Lanjut
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ClassSelectionPage;
