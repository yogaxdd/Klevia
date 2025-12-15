import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { lessons } from '../data/allLessons';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';

function LevelMapPage() {
    const navigate = useNavigate();
    const { user, progress } = useApp();

    // Check if current subject is TKA
    const isTKA = user.subject === 'tka';

    // Filter lessons by selected subject AND user's grade (kelas), sort by order
    const filteredLessons = lessons
        .filter(lesson => lesson.subject === user.subject && lesson.grade === user.kelas)
        .sort((a, b) => a.order - b.order);

    // For TKA: separate by category
    const wajibLessons = isTKA ? filteredLessons.filter(l => l.category === 'wajib') : [];
    const pilihanLessons = isTKA ? filteredLessons.filter(l => l.category === 'pilihan') : [];

    // Count completed lessons
    const completedCount = filteredLessons.filter(l => progress.lessons[l.id]?.completed).length;
    const totalLessons = filteredLessons.length;

    // Get lesson status - TKA lessons are never locked
    const getLessonStatus = (lesson, index, lessonList) => {
        const lessonProgress = progress.lessons[lesson.id];

        // If lesson is completed
        if (lessonProgress?.completed) return 'completed';

        // TKA lessons are always available (no lock)
        if (isTKA) return 'available';

        // First lesson is always accessible
        if (index === 0) return 'available';

        // Check if previous lesson is completed
        const prevLesson = lessonList[index - 1];
        const prevLessonProgress = progress.lessons[prevLesson?.id];

        if (prevLessonProgress?.completed) {
            return 'available';
        }

        return 'locked';
    };

    const handleLessonClick = (lesson, index, lessonList) => {
        const status = getLessonStatus(lesson, index, lessonList);
        if (status === 'locked') return;
        navigate(`/lesson/${lesson.id}`);
    };

    const getSubjectLabel = (subject) => {
        const labels = {
            matematika: 'Matematika',
            ipa: 'IPA',
            bahasa: 'Bahasa Indonesia',
            english: 'Bahasa Inggris',
            biologi: 'Biologi',
            kimia: 'Kimia',
            fisika: 'Fisika',
            ekonomi: 'Ekonomi',
            sosiologi: 'Sosiologi',
            geografi: 'Geografi',
            sejarah: 'Sejarah',
            pkn: 'PKN',
            informatika: 'Informatika',
            tka: 'TKA',
        };
        return labels[subject] || 'Pelajaran';
    };

    // Render lesson card
    const renderLessonCard = (lesson, index, lessonList) => {
        const status = getLessonStatus(lesson, index, lessonList);
        const lessonProgress = progress.lessons[lesson.id];

        return (
            <Card
                key={lesson.id}
                hoverable={status !== 'locked'}
                onClick={() => handleLessonClick(lesson, index, lessonList)}
                className={`relative transition-all duration-300 ${status === 'locked'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover-lift cursor-pointer'
                    }`}
            >
                <div className="flex items-center gap-4">
                    {/* Lesson Icon */}
                    <div className={`
                        flex h-14 w-14 items-center justify-center rounded-xl shrink-0 transition-colors
                        ${status === 'completed' ? 'bg-primary/20' :
                            status === 'locked' ? 'bg-gray-100' : 'bg-soft-blue/30'}
                    `}>
                        {status === 'completed' ? (
                            <span
                                className="material-symbols-outlined text-primary text-2xl"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                check_circle
                            </span>
                        ) : status === 'locked' ? (
                            <span className="material-symbols-outlined text-gray-400 text-2xl">
                                lock
                            </span>
                        ) : (
                            <span className="text-xl font-bold text-blue-600">{lesson.order}</span>
                        )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-text-main truncate">{lesson.title}</h3>
                            {/* TKA Subject Badge */}
                            {lesson.tkaSubject && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium shrink-0">
                                    {lesson.tkaSubject}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-text-secondary truncate">{lesson.description}</p>

                        {/* Progress or XP */}
                        <div className="flex items-center gap-2 mt-2">
                            {status === 'completed' ? (
                                <span className="text-xs font-medium text-primary">
                                    Selesai {lessonProgress?.score}/{lessonProgress?.totalQuestions || lesson.questionsCount} • +{lesson.xpReward} XP
                                </span>
                            ) : status === 'locked' ? (
                                <span className="text-xs text-gray-400">
                                    🔒 Selesaikan pelajaran sebelumnya
                                </span>
                            ) : (
                                <>
                                    <span className="text-xs text-text-secondary">
                                        {lesson.questionsCount} soal
                                    </span>
                                    <span className="text-xs text-text-secondary">•</span>
                                    <span className="text-xs text-primary font-medium">
                                        +{lesson.xpReward} XP
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Arrow */}
                    {status !== 'locked' && (
                        <span className="material-symbols-outlined text-gray-300">
                            chevron_right
                        </span>
                    )}
                </div>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background pb-28">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <header className="px-6 pt-10 pb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center text-text-secondary hover:text-text-main mb-4 transition-colors"
                    >
                        <span className="material-symbols-outlined mr-1">arrow_back</span>
                        Kembali
                    </button>

                    <h1 className="text-2xl font-bold text-text-main mb-1">
                        {isTKA ? 'Latihan TKA' : 'Pelajaran'}
                    </h1>
                    <p className="text-text-secondary">
                        {isTKA ? 'Pilih latihan soal TKA sesuai kebutuhan' : 'Pilih pelajaran untuk mulai belajar'}
                    </p>

                    {/* Progress Badge - Clickable to change subject */}
                    <button
                        onClick={() => navigate('/select-subject')}
                        className="mt-4 p-3 bg-primary/10 rounded-xl flex items-center justify-between w-full hover:bg-primary/20 transition-colors group"
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                school
                            </span>
                            <span className="font-medium text-text-main">
                                {getSubjectLabel(user.subject)} {user.kelas ? `Kelas ${user.kelas}` : ''}
                            </span>
                            <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-primary transition-colors">
                                edit
                            </span>
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-primary">{completedCount}</span>
                            <span className="text-text-secondary">/{totalLessons} selesai</span>
                        </div>
                    </button>

                    {/* All Complete Message */}
                    {completedCount === totalLessons && totalLessons > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                                emoji_events
                            </span>
                            <span className="text-sm text-yellow-700 font-medium">
                                🎉 Kamu sudah menyelesaikan semua materi {getSubjectLabel(user.subject)}!
                            </span>
                        </div>
                    )}
                </header>

                {/* Lesson List */}
                <section className="px-6">
                    {/* TKA View - With Categories */}
                    {isTKA ? (
                        <div className="flex flex-col gap-6">
                            {/* Mata Pelajaran Wajib */}
                            {wajibLessons.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">verified</span>
                                        Mata Pelajaran Wajib
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        {wajibLessons.map((lesson, index) => renderLessonCard(lesson, index, wajibLessons))}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            {wajibLessons.length > 0 && pilihanLessons.length > 0 && (
                                <hr className="border-border" />
                            )}

                            {/* Mata Pelajaran Pilihan */}
                            {pilihanLessons.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-secondary">apps</span>
                                        Mata Pelajaran Pilihan
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        {pilihanLessons.map((lesson, index) => renderLessonCard(lesson, index, pilihanLessons))}
                                    </div>
                                </div>
                            )}

                            {/* Coming Soon for Pilihan if empty */}
                            {pilihanLessons.length === 0 && wajibLessons.length > 0 && (
                                <>
                                    <hr className="border-border" />
                                    <div>
                                        <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-secondary">apps</span>
                                            Mata Pelajaran Pilihan
                                        </h2>
                                        <div className="text-center py-8 bg-surface rounded-xl border border-dashed border-border">
                                            <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">hourglass_empty</span>
                                            <p className="text-text-secondary text-sm">Segera hadir...</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* Regular View - Standard list */
                        <div className="flex flex-col gap-4 stagger-children">
                            {filteredLessons.map((lesson, index) => renderLessonCard(lesson, index, filteredLessons))}

                            {/* Empty state - belum pilih kelas */}
                            {filteredLessons.length === 0 && !user.kelas && (
                                <div className="text-center py-10 animate-fadeIn">
                                    <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">
                                        school
                                    </span>
                                    <p className="text-text-secondary mb-1">Kamu belum memilih kelas</p>
                                    <p className="text-sm text-text-secondary mb-3">Pilih kelas dulu untuk melihat materi</p>
                                    <button
                                        className="text-primary font-medium hover:underline"
                                        onClick={() => navigate('/select-class')}
                                    >
                                        Pilih kelas
                                    </button>
                                </div>
                            )}

                            {/* Empty state - sudah pilih kelas tapi belum pilih subject */}
                            {filteredLessons.length === 0 && user.kelas && !user.subject && (
                                <div className="text-center py-10 animate-fadeIn">
                                    <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">
                                        menu_book
                                    </span>
                                    <p className="text-text-secondary mb-1">Belum ada pelajaran tersedia</p>
                                    <p className="text-sm text-text-secondary mb-3">Pilih mata pelajaran untuk mulai belajar</p>
                                    <button
                                        className="text-primary font-medium hover:underline"
                                        onClick={() => navigate('/select-subject')}
                                    >
                                        Pilih mata pelajaran
                                    </button>
                                </div>
                            )}

                            {/* Empty state - sudah pilih keduanya tapi tidak ada materi */}
                            {filteredLessons.length === 0 && user.kelas && user.subject && (
                                <div className="text-center py-10 animate-fadeIn">
                                    <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">
                                        menu_book
                                    </span>
                                    <p className="text-text-secondary">Materi untuk {getSubjectLabel(user.subject)} Kelas {user.kelas} belum tersedia</p>
                                    <button
                                        className="text-primary font-medium mt-2 hover:underline"
                                        onClick={() => navigate('/select-subject')}
                                    >
                                        Ganti mata pelajaran
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <BottomNav />
        </div>
    );
}

export default LevelMapPage;
