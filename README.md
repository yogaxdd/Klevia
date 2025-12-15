# KLEVIA - Platform Belajar Interaktif 🚀

**Versi 2.0** | Platform edukasi modern untuk siswa SMP dan SMA di Indonesia.

KLEVIA dirancang untuk membuat belajar menjadi menyenangkan, interaktif, dan terpersonalisasi. Menggabungkan elemen gamifikasi dengan materi pelajaran sesuai kurikulum.

## ✨ Fitur Unggulan

### 🎮 Gamifikasi Pembelajaran
- **Sistem Level & XP**: Dapatkan XP dari setiap jawaban benar dan naikkan levelmu.
- **Nyawa (Hearts)**: Tantangan belajar dengan sistem nyawa.
- **Streak Harian**: Bangun kebiasaan belajar rutin.
- **Leaderboard**: Bersaing dengan pengguna lain.
- **Achievements**: Koleksi lencana prestasi.

### ⚔️ Quiz Battle 1v1 (NEW!)
- **Real-time Multiplayer**: Tantang temanmu dalam pertandingan kuis langsung.
- **Room Code**: Buat atau gabung room dengan kode 6 karakter.
- **Pilih Kelas & Mapel**: Pilih kelas (7-12) dan mata pelajaran tertentu atau semua mapel.
- **Multiple Mode**: Timed (waktu per soal) atau Race (balapan selesai).
- **Auto-Reconnect**: Keluar dan masuk lagi? Lanjutkan dari soal terakhir.
- **Live Score**: Pantau skor lawan secara real-time.

### 📚 Materi Lengkap
- SMP (Kelas 7-9): Matematika, IPA, Bahasa Indonesia, Bahasa Inggris.
- SMA (Kelas 10-12): Matematika, Biologi, Kimia, Fisika, Ekonomi, Sosiologi, Geografi, Sejarah, PKn, Informatika.

### 🤖 AI-Powered Learning
- **Koreksi Esai Otomatis**: Menggunakan Google Gemini AI.
- **Penjelasan Mendalam**: Feedback detail untuk setiap jawaban.

### 🛠️ Fitur Lainnya
- **🌙 Dark Mode**: Tampilan nyaman di mata.
- **🔊 Sound Effects**: Efek suara interaktif.
- **💪 Mode Latihan**: Berlatih tanpa takut kehilangan nyawa.
- **📝 SRS Review**: Spaced Repetition System untuk review jawaban salah.
- **📅 Kuis Harian**: 5 soal unik setiap hari dengan bonus XP.

## 🛠️ Teknologi

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth & Firestore)
- **AI**: Google Gemini API
- **Deployment**: Vercel

## 🚀 Cara Menjalankan

```bash
# Clone repo
git clone https://github.com/username/Klevia.git
cd Klevia

# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit .env dengan konfigurasi Firebase & Gemini API

# Run dev server
npm run dev
```

## 📂 Struktur Project

```
Klevia/
├── src/
│   ├── components/      # UI Components
│   ├── context/         # React Context
│   ├── data/            # Questions & Lessons
│   ├── firebase/        # Firebase Config
│   ├── pages/           # App Pages
│   ├── services/        # Battle, AI, Sound
│   └── App.jsx          # Root & Routing
└── package.json
```

## 📝 Changelog v2.0

- ✅ **Quiz Battle 1v1** - Real-time multiplayer quiz
- ✅ **Room System** - Create/Join with 6-char code
- ✅ **Subject Selection** - Filter by kelas & mapel
- ✅ **Reconnect Support** - Resume from last question
- ✅ **SMA Questions** - Full question bank for Kelas 10-12
- ✅ **Enhanced UI** - Better stats, fixed layouts
- ✅ **Security** - Unauthorized access prevention

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat *pull request*.

## 📄 Lisensi

[MIT License](LICENSE)
