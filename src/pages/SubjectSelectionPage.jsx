import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';

function SubjectSelectionPage() {
    const navigate = useNavigate();
    const { user, updateUser } = useApp();

    const subjects = [
        {
            id: 'matematika',
            label: 'Matematika',
            icon: 'calculate',
            color: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            id: 'ipa',
            label: 'IPA',
            icon: 'science',
            color: 'bg-green-100',
            iconColor: 'text-green-600',
            grades: [7, 8, 9], // Only for SMP
        },
        {
            id: 'bahasa',
            label: 'Bahasa Indonesia',
            icon: 'menu_book',
            color: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            id: 'english',
            label: 'Bahasa Inggris',
            icon: 'translate',
            color: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            id: 'biologi',
            label: 'Biologi',
            icon: 'genetics',
            color: 'bg-lime-100',
            iconColor: 'text-lime-600',
            grades: [10, 11, 12], // Only for SMA
        },
        {
            id: 'kimia',
            label: 'Kimia',
            icon: 'experiment',
            color: 'bg-amber-100',
            iconColor: 'text-amber-600',
            grades: [10, 11, 12],
        },
        {
            id: 'fisika',
            label: 'Fisika',
            icon: 'bolt',
            color: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            grades: [10, 11, 12],
        },
        {
            id: 'ekonomi',
            label: 'Ekonomi',
            icon: 'payments',
            color: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            grades: [10, 11, 12],
        },
        {
            id: 'sosiologi',
            label: 'Sosiologi',
            icon: 'groups',
            color: 'bg-pink-100',
            iconColor: 'text-pink-600',
            grades: [10, 11, 12],
        },
        {
            id: 'geografi',
            label: 'Geografi',
            icon: 'public',
            color: 'bg-teal-100',
            iconColor: 'text-teal-600',
            grades: [10, 11, 12],
        },
        {
            id: 'sejarah',
            label: 'Sejarah',
            icon: 'history_edu',
            color: 'bg-stone-100',
            iconColor: 'text-stone-600',
            grades: [10, 11, 12],
        },
        {
            id: 'pkn',
            label: 'PKN',
            icon: 'gavel',
            color: 'bg-red-100',
            iconColor: 'text-red-600',
            grades: [10, 11, 12],
        },
        {
            id: 'informatika',
            label: 'Informatika',
            icon: 'code',
            color: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            grades: [10, 11, 12],
        },
    ];

    // Filter subjects based on selected grade
    const filteredSubjects = subjects.filter(subject => {
        if (!subject.grades) return true; // Available for all grades
        return subject.grades.includes(user.kelas);
    });

    const handleSelectSubject = (subjectId) => {
        updateUser({ subject: subjectId });
    };

    const handleContinue = () => {
        if (user.subject) {
            navigate('/home');
        }
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
                    Pilih Mata Pelajaran
                </h1>
                <p className="text-text-secondary">
                    Kamu bisa menggantinya nanti di pengaturan
                </p>
            </div>

            {/* Subject Options */}
            <div className="grid grid-cols-2 gap-4 flex-1 content-start">
                {filteredSubjects.map((subject) => (
                    <Card
                        key={subject.id}
                        hoverable
                        onClick={() => handleSelectSubject(subject.id)}
                        className={`${user.subject === subject.id ? 'ring-2 ring-primary border-primary' : ''}`}
                        padding="lg"
                    >
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${subject.color}`}>
                                <span className={`material-symbols-outlined text-3xl ${subject.iconColor}`}>
                                    {subject.icon}
                                </span>
                            </div>
                            <h3 className="font-bold text-text-main text-sm leading-tight">
                                {subject.label}
                            </h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Continue Button */}
            <div className="mt-6">
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleContinue}
                    disabled={!user.subject}
                >
                    Mulai Belajar
                </Button>
            </div>
        </div>
    );
}

export default SubjectSelectionPage;
