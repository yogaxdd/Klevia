# KLEVIA - Platform Belajar Interaktif 🚀

KLEVIA adalah aplikasi web edukasi modern yang dirancang untuk membuat belajar menjadi menyenangkan, interaktif, dan terpersonalisasi bagi siswa SMP dan SMA di Indonesia. Menggabungkan elemen gamifikasi dengan materi pelajaran sesuai kurikulum, KLEVIA memotivasi siswa untuk belajar secara konsisten setiap hari.

![Klevia Banner](/public/Assets/klevia-banner.png) *(Placeholder)*

## ✨ Fitur Unggulan

### 🎮 Gamifikasi Pembelajaran
- **Sistem Level & XP**: Dapatkan XP dari setiap jawaban benar dan naikkan levelmu.
- **Nyawa (Hearts)**: Tantangan belajar dengan sistem nyawa. Hati-hati, jawaban salah akan mengurangi nyawamu!
- **Streak Harian**: Bangun kebiasaan belajar rutin dan pertahankan api streakmu menyala.
- **Leaderboard**: Bersaing dengan teman sekelas dan pengguna lain untuk menjadi juara mingguan.
- **Achievements**: Koleksi lencana prestasi untuk berbagai pencapaian belajarmu.

### 📚 Materi Lengkap
- Mencakup berbagai mata pelajaran: Matematika, IPA, Bahasa Indonesia, Bahasa Inggris, Biologi, Fisika, Kimia, Ekonomi, Sosiologi, Geografi, Sejarah, dll.
- Materi disesuaikan untuk jenjang SMP (Kelas 7-9) dan SMA (Kelas 10-12).
- Pilihan materi spesifik sesuai minat (Biologi, Saintek, Soshum, dll).

### 🤖 AI-Powered Learning
- **Koreksi Esai Otomatis**: Menggunakan **Google Gemini AI** untuk menilai jawaban esai secara akurat dan memberikan umpan balik yang membangun, bukan hanya mencocokkan kata kunci.
- **Penjelasan Mendalam**: Dapatkan penjelasan detail kenapa jawabanmu benar atau salah.

### 🛠️ Fitur Baru (Terbaru)
- **🌙 Dark Mode**: Tampilan yang nyaman di mata untuk belajar di malam hari. Tersedia di menu Pengaturan.
- **🔊 Sound Effects**: Efek suara interaktif untuk jawaban benar, salah, naik level, dan lainnya (dapat dimatikan).
- **💪 Mode Latihan**: Berlatih tanpa takut kehilangan nyawa atau XP. Fokus pada pemahaman materi.
- **📝 Review Salah**: Fitur pintar yang menyimpan jawaban salahmu agar bisa dipelajari dan diulang kembali sampai paham.

### 📅 Kuis Harian
- Tantangan 5 soal unik setiap hari.
- Bonus XP besar untuk penyelesaian harian.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) - Untuk performa super cepat.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Desain modern, responsif, dan mudah dikustomisasi.
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore) - Real-time database dan autentikasi aman (Google Sign-In).
- **AI**: [Google Gemini API](https://ai.google.dev/) - Otak di balik penilaian esai pintar.
- **Deployment**: Vercel (Recommended).

## 🚀 Cara Menjalankan Project (Local Development)

Ikuti langkah-langkah ini untuk menjalankan KLEVIA di komputer lokalmu:

### Prasyarat
- Node.js (v16 atau lebih baru)
- NPM atau Yarn
- Akun Firebase & Google Cloud (untuk API Key)

### Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/username/Klevia.git
   cd Klevia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Elements**
   Buat file `.env` di root folder dan isi dengan konfigurasi Firebase dan Gemini API karian:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Akses aplikasi di `http://localhost:5173`.

## 📂 Struktur Project

```
Klevia/
├── public/              # Aset statis (gambar, icon)
├── src/
│   ├── components/      # Komponen UI reusable (Button, Card, dll)
│   ├── context/         # React Context (Auth, Theme, App State)
│   ├── data/            # Data statis (Soal, Materi)
│   ├── firebase/        # Konfigurasi Firebase
│   ├── pages/           # Halaman-halaman aplikasi
│   ├── services/        # Logic bisnis & API (Gemini, Sound)
│   ├── App.jsx          # Root component & Routing
│   └── index.css        # Global styles & Tailwind directives
├── .env                 # Environment variables (JANGAN DI-COMMIT)
├── index.html           # Entry point HTML
├── tailwind.config.js   # Konfigurasi Tailwind & Dark Mode
└── vite.config.js       # Konfigurasi Vite
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat *pull request* untuk memperbaiki bug atau menambahkan fitur baru.

## 📄 Lisensi

[MIT License](LICENSE)
