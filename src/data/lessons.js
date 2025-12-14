// Lesson data for KLEVIA
// Separated by grade level (Kelas 7, 8, 9)
// Each grade has 10 lessons per subject with varying question counts

export const lessons = [
    // ============================================
    // KELAS 7
    // ============================================

    // MATEMATIKA - Kelas 7 (10 materi, 7-10 soal per materi)
    { id: 101, title: "Bilangan Bulat", subject: "matematika", grade: 7, description: "Operasi penjumlahan dan pengurangan bilangan bulat", questionsCount: 10, xpReward: 70, order: 1 },
    { id: 102, title: "Pecahan", subject: "matematika", grade: 7, description: "Operasi hitung pecahan biasa dan desimal", questionsCount: 10, xpReward: 70, order: 2 },
    { id: 103, title: "Bentuk Aljabar", subject: "matematika", grade: 7, description: "Pengenalan variabel dan konstanta", questionsCount: 10, xpReward: 70, order: 3 },
    { id: 104, title: "Perbandingan", subject: "matematika", grade: 7, description: "Perbandingan senilai dan berbalik nilai", questionsCount: 7, xpReward: 60, order: 4 },
    { id: 1005, title: "Himpunan", subject: "matematika", grade: 7, description: "Pengertian dan notasi himpunan", questionsCount: 10, xpReward: 70, order: 5 },
    { id: 1006, title: "Garis dan Sudut", subject: "matematika", grade: 7, description: "Jenis-jenis garis dan sudut", questionsCount: 8, xpReward: 65, order: 6 },
    { id: 1007, title: "Segiempat", subject: "matematika", grade: 7, description: "Persegi, persegi panjang, dan layang-layang", questionsCount: 6, xpReward: 55, order: 7 },
    { id: 1008, title: "Segitiga", subject: "matematika", grade: 7, description: "Keliling dan luas segitiga", questionsCount: 5, xpReward: 50, order: 8 },
    { id: 1009, title: "Data dan Statistika", subject: "matematika", grade: 7, description: "Mean, median, modus", questionsCount: 7, xpReward: 60, order: 9 },
    { id: 1010, title: "Peluang", subject: "matematika", grade: 7, description: "Pengertian peluang sederhana", questionsCount: 5, xpReward: 50, order: 10 },

    // IPA - Kelas 7 (7-10 soal per materi)
    { id: 105, title: "Pengukuran", subject: "ipa", grade: 7, description: "Besaran pokok dan satuan SI", questionsCount: 10, xpReward: 70, order: 1 },
    { id: 106, title: "Klasifikasi Makhluk Hidup", subject: "ipa", grade: 7, description: "Ciri-ciri dan pengelompokan makhluk hidup", questionsCount: 6, xpReward: 55, order: 2 },
    { id: 107, title: "Zat dan Karakteristiknya", subject: "ipa", grade: 7, description: "Sifat zat padat, cair, dan gas", questionsCount: 10, xpReward: 70, order: 3 },
    { id: 108, title: "Suhu dan Kalor", subject: "ipa", grade: 7, description: "Pengukuran suhu dan perpindahan kalor", questionsCount: 7, xpReward: 60, order: 4 },
    { id: 1011, title: "Ekosistem", subject: "ipa", grade: 7, description: "Komponen dan interaksi ekosistem", questionsCount: 5, xpReward: 50, order: 5 },
    { id: 1012, title: "Pencemaran Lingkungan", subject: "ipa", grade: 7, description: "Dampak dan pencegahan pencemaran", questionsCount: 6, xpReward: 55, order: 6 },
    { id: 1013, title: "Energi", subject: "ipa", grade: 7, description: "Bentuk-bentuk energi", questionsCount: 10, xpReward: 70, order: 7 },
    { id: 1014, title: "Tata Surya", subject: "ipa", grade: 7, description: "Planet dan benda langit", questionsCount: 8, xpReward: 65, order: 8 },
    { id: 1015, title: "Lapisan Bumi", subject: "ipa", grade: 7, description: "Struktur bumi dan lapisan atmosfer", questionsCount: 10, xpReward: 70, order: 9 },
    { id: 1016, title: "Perubahan Iklim", subject: "ipa", grade: 7, description: "Pemanasan global dan dampaknya", questionsCount: 6, xpReward: 55, order: 10 },

    // BAHASA INDONESIA - Kelas 7
    { id: 109, title: "Teks Deskripsi", subject: "bahasa", grade: 7, description: "Memahami struktur teks deskripsi", questionsCount: 5, xpReward: 50, order: 1 },
    { id: 110, title: "Teks Narasi", subject: "bahasa", grade: 7, description: "Unsur-unsur cerita dan alur", questionsCount: 6, xpReward: 55, order: 2 },
    { id: 111, title: "Puisi Rakyat", subject: "bahasa", grade: 7, description: "Pantun, gurindam, dan syair", questionsCount: 5, xpReward: 50, order: 3 },
    { id: 112, title: "Fabel", subject: "bahasa", grade: 7, description: "Cerita hewan dan pesan moral", questionsCount: 7, xpReward: 60, order: 4 },
    { id: 1017, title: "Prosedur", subject: "bahasa", grade: 7, description: "Teks prosedur dan langkah-langkah", questionsCount: 5, xpReward: 50, order: 5 },
    { id: 1018, title: "Surat Pribadi", subject: "bahasa", grade: 7, description: "Menulis surat untuk teman", questionsCount: 6, xpReward: 55, order: 6 },
    { id: 1019, title: "Laporan Observasi", subject: "bahasa", grade: 7, description: "Menulis hasil pengamatan", questionsCount: 5, xpReward: 50, order: 7 },
    { id: 1020, title: "Legenda", subject: "bahasa", grade: 7, description: "Cerita rakyat dan legenda", questionsCount: 5, xpReward: 50, order: 8 },
    { id: 1021, title: "Kalimat Efektif", subject: "bahasa", grade: 7, description: "Menyusun kalimat yang baik", questionsCount: 6, xpReward: 55, order: 9 },
    { id: 1022, title: "Kata Baku", subject: "bahasa", grade: 7, description: "Penggunaan kata baku dan tidak baku", questionsCount: 5, xpReward: 50, order: 10 },

    // BAHASA INGGRIS - Kelas 7
    { id: 113, title: "Greetings & Introduction", subject: "english", grade: 7, description: "Cara menyapa dan memperkenalkan diri", questionsCount: 5, xpReward: 50, order: 1 },
    { id: 114, title: "Numbers & Time", subject: "english", grade: 7, description: "Angka dan cara menyebutkan waktu", questionsCount: 6, xpReward: 55, order: 2 },
    { id: 115, title: "Things Around Us", subject: "english", grade: 7, description: "Benda-benda di sekitar kita", questionsCount: 5, xpReward: 50, order: 3 },
    { id: 116, title: "Describing People", subject: "english", grade: 7, description: "Mendeskripsikan orang dan sifat", questionsCount: 7, xpReward: 60, order: 4 },
    { id: 1023, title: "Daily Activities", subject: "english", grade: 7, description: "Kegiatan sehari-hari", questionsCount: 5, xpReward: 50, order: 5 },
    { id: 1024, title: "Family Members", subject: "english", grade: 7, description: "Anggota keluarga dalam bahasa Inggris", questionsCount: 5, xpReward: 50, order: 6 },
    { id: 1025, title: "Days & Months", subject: "english", grade: 7, description: "Hari dan bulan dalam setahun", questionsCount: 6, xpReward: 55, order: 7 },
    { id: 1026, title: "Hobbies", subject: "english", grade: 7, description: "Menyatakan hobi dan kegemaran", questionsCount: 5, xpReward: 50, order: 8 },
    { id: 1027, title: "Animals", subject: "english", grade: 7, description: "Nama-nama hewan", questionsCount: 5, xpReward: 50, order: 9 },
    { id: 1028, title: "Food & Drinks", subject: "english", grade: 7, description: "Makanan dan minuman", questionsCount: 6, xpReward: 55, order: 10 },

    // ============================================
    // KELAS 8
    // ============================================

    // MATEMATIKA - Kelas 8 (7-10 soal per materi)
    { id: 201, title: "Sistem Koordinat", subject: "matematika", grade: 8, description: "Koordinat kartesius dan kuadran", questionsCount: 10, xpReward: 70, order: 1 },
    { id: 202, title: "Relasi dan Fungsi", subject: "matematika", grade: 8, description: "Pengertian relasi, fungsi, dan grafiknya", questionsCount: 6, xpReward: 65, order: 2 },
    { id: 203, title: "Persamaan Linear Dua Variabel", subject: "matematika", grade: 8, description: "PLDV dan grafik garis lurus", questionsCount: 7, xpReward: 70, order: 3 },
    { id: 204, title: "Teorema Pythagoras", subject: "matematika", grade: 8, description: "Hubungan sisi-sisi segitiga siku-siku", questionsCount: 10, xpReward: 70, order: 4 },
    { id: 2005, title: "Lingkaran", subject: "matematika", grade: 8, description: "Keliling dan luas lingkaran", questionsCount: 6, xpReward: 65, order: 5 },
    { id: 2006, title: "Bangun Ruang Sisi Datar", subject: "matematika", grade: 8, description: "Kubus, balok, dan prisma", questionsCount: 8, xpReward: 75, order: 6 },
    { id: 2007, title: "Statistika", subject: "matematika", grade: 8, description: "Diagram dan ukuran pemusatan data", questionsCount: 10, xpReward: 80, order: 7 },
    { id: 2008, title: "Peluang", subject: "matematika", grade: 8, description: "Frekuensi relatif dan peluang", questionsCount: 6, xpReward: 65, order: 8 },
    { id: 2009, title: "Pola Bilangan", subject: "matematika", grade: 8, description: "Barisan dan deret aritmatika", questionsCount: 10, xpReward: 80, order: 9 },
    { id: 2010, title: "Gradien", subject: "matematika", grade: 8, description: "Kemiringan garis lurus", questionsCount: 5, xpReward: 60, order: 10 },

    // IPA - Kelas 8 (8-10 soal per materi)
    { id: 205, title: "Gerak Benda", subject: "ipa", grade: 8, description: "Gerak lurus beraturan dan berubah beraturan", questionsCount: 6, xpReward: 65, order: 1 },
    { id: 206, title: "Gaya dan Hukum Newton", subject: "ipa", grade: 8, description: "Hukum I, II, III Newton", questionsCount: 7, xpReward: 70, order: 2 },
    { id: 207, title: "Usaha dan Energi", subject: "ipa", grade: 8, description: "Energi kinetik dan potensial", questionsCount: 10, xpReward: 80, order: 3 },
    { id: 208, title: "Tekanan Zat", subject: "ipa", grade: 8, description: "Tekanan zat padat, cair, dan gas", questionsCount: 6, xpReward: 65, order: 4 },
    { id: 2011, title: "Sistem Pernapasan", subject: "ipa", grade: 8, description: "Organ pernapasan manusia", questionsCount: 10, xpReward: 80, order: 5 },
    { id: 2012, title: "Sistem Pencernaan", subject: "ipa", grade: 8, description: "Organ pencernaan dan enzim", questionsCount: 7, xpReward: 70, order: 6 },
    { id: 2013, title: "Sistem Peredaran Darah", subject: "ipa", grade: 8, description: "Jantung dan pembuluh darah", questionsCount: 6, xpReward: 65, order: 7 },
    { id: 2014, title: "Getaran dan Gelombang", subject: "ipa", grade: 8, description: "Periode, frekuensi, dan amplitudo", questionsCount: 10, xpReward: 80, order: 8 },
    { id: 2015, title: "Bunyi", subject: "ipa", grade: 8, description: "Sifat gelombang bunyi", questionsCount: 10, xpReward: 80, order: 9 },
    { id: 2016, title: "Cahaya", subject: "ipa", grade: 8, description: "Pemantulan dan pembiasan cahaya", questionsCount: 6, xpReward: 65, order: 10 },

    // BAHASA INDONESIA - Kelas 8 (8-10 soal per materi)
    { id: 209, title: "Teks Berita", subject: "bahasa", grade: 8, description: "Struktur dan unsur berita 5W+1H", questionsCount: 10, xpReward: 80, order: 1 },
    { id: 210, title: "Teks Iklan", subject: "bahasa", grade: 8, description: "Slogan dan poster", questionsCount: 6, xpReward: 65, order: 2 },
    { id: 211, title: "Teks Eksposisi", subject: "bahasa", grade: 8, description: "Argumen dan fakta pendukung", questionsCount: 10, xpReward: 80, order: 3 },
    { id: 212, title: "Teks Puisi", subject: "bahasa", grade: 8, description: "Unsur batin dan fisik puisi", questionsCount: 7, xpReward: 70, order: 4 },
    { id: 2017, title: "Teks Ulasan", subject: "bahasa", grade: 8, description: "Review buku dan film", questionsCount: 5, xpReward: 60, order: 5 },
    { id: 2018, title: "Teks Persuasi", subject: "bahasa", grade: 8, description: "Membujuk pembaca", questionsCount: 6, xpReward: 65, order: 6 },
    { id: 2019, title: "Drama", subject: "bahasa", grade: 8, description: "Unsur-unsur drama", questionsCount: 5, xpReward: 60, order: 7 },
    { id: 2020, title: "Teks Biografi", subject: "bahasa", grade: 8, description: "Menulis riwayat hidup", questionsCount: 5, xpReward: 60, order: 8 },
    { id: 2021, title: "Majas", subject: "bahasa", grade: 8, description: "Gaya bahasa dalam sastra", questionsCount: 6, xpReward: 65, order: 9 },
    { id: 2022, title: "Konjungsi", subject: "bahasa", grade: 8, description: "Kata hubung dalam kalimat", questionsCount: 5, xpReward: 60, order: 10 },

    // BAHASA INGGRIS - Kelas 8
    { id: 213, title: "Simple Present Tense", subject: "english", grade: 8, description: "Kebiasaan dan fakta umum", questionsCount: 6, xpReward: 65, order: 1 },
    { id: 214, title: "Simple Past Tense", subject: "english", grade: 8, description: "Kegiatan di masa lampau", questionsCount: 5, xpReward: 60, order: 2 },
    { id: 215, title: "Comparison Degree", subject: "english", grade: 8, description: "Membandingkan sifat dan benda", questionsCount: 7, xpReward: 70, order: 3 },
    { id: 216, title: "Recount Text", subject: "english", grade: 8, description: "Menceritakan pengalaman", questionsCount: 5, xpReward: 60, order: 4 },
    { id: 2023, title: "Narrative Text", subject: "english", grade: 8, description: "Cerita fiksi dan dongeng", questionsCount: 6, xpReward: 65, order: 5 },
    { id: 2024, title: "Invitation", subject: "english", grade: 8, description: "Membuat undangan", questionsCount: 5, xpReward: 60, order: 6 },
    { id: 2025, title: "Greeting Card", subject: "english", grade: 8, description: "Kartu ucapan selamat", questionsCount: 5, xpReward: 60, order: 7 },
    { id: 2026, title: "Modals", subject: "english", grade: 8, description: "Can, could, may, might", questionsCount: 6, xpReward: 65, order: 8 },
    { id: 2027, title: "Conditional", subject: "english", grade: 8, description: "Kalimat pengandaian if", questionsCount: 5, xpReward: 60, order: 9 },
    { id: 2028, title: "Song Lyrics", subject: "english", grade: 8, description: "Memahami lirik lagu", questionsCount: 5, xpReward: 60, order: 10 },

    // ============================================
    // KELAS 9
    // ============================================

    // MATEMATIKA - Kelas 9 (7-10 soal per materi)
    { id: 301, title: "Perpangkatan dan Bentuk Akar", subject: "matematika", grade: 9, description: "Operasi bilangan berpangkat dan akar", questionsCount: 10, xpReward: 80, order: 1 },
    { id: 302, title: "Persamaan Kuadrat", subject: "matematika", grade: 9, description: "Menentukan akar persamaan kuadrat", questionsCount: 7, xpReward: 75, order: 2 },
    { id: 303, title: "Fungsi Kuadrat", subject: "matematika", grade: 9, description: "Grafik parabola dan titik puncak", questionsCount: 10, xpReward: 80, order: 3 },
    { id: 304, title: "Kesebangunan dan Kekongruenan", subject: "matematika", grade: 9, description: "Sifat bangun yang sebangun", questionsCount: 6, xpReward: 75, order: 4 },
    { id: 3005, title: "Bangun Ruang Sisi Lengkung", subject: "matematika", grade: 9, description: "Tabung, kerucut, dan bola", questionsCount: 8, xpReward: 80, order: 5 },
    { id: 3006, title: "Transformasi Geometri", subject: "matematika", grade: 9, description: "Translasi, rotasi, refleksi", questionsCount: 5, xpReward: 70, order: 6 },
    { id: 3007, title: "Barisan dan Deret", subject: "matematika", grade: 9, description: "Aritmatika dan geometri", questionsCount: 6, xpReward: 75, order: 7 },
    { id: 3008, title: "Statistika Lanjut", subject: "matematika", grade: 9, description: "Kuartil dan persentil", questionsCount: 5, xpReward: 70, order: 8 },
    { id: 3009, title: "Peluang Lanjut", subject: "matematika", grade: 9, description: "Peluang kejadian majemuk", questionsCount: 6, xpReward: 75, order: 9 },
    { id: 3010, title: "Logaritma", subject: "matematika", grade: 9, description: "Operasi dan sifat logaritma", questionsCount: 5, xpReward: 70, order: 10 },

    // IPA - Kelas 9
    { id: 305, title: "Sistem Reproduksi", subject: "ipa", grade: 9, description: "Organ reproduksi dan pubertas", questionsCount: 6, xpReward: 75, order: 1 },
    { id: 306, title: "Pewarisan Sifat", subject: "ipa", grade: 9, description: "Gen, kromosom, dan hukum Mendel", questionsCount: 7, xpReward: 80, order: 2 },
    { id: 307, title: "Listrik Statis", subject: "ipa", grade: 9, description: "Muatan listrik dan hukum Coulomb", questionsCount: 5, xpReward: 70, order: 3 },
    { id: 308, title: "Listrik Dinamis", subject: "ipa", grade: 9, description: "Arus, tegangan, dan hukum Ohm", questionsCount: 6, xpReward: 75, order: 4 },
    { id: 3011, title: "Kemagnetan", subject: "ipa", grade: 9, description: "Magnet dan medan magnet", questionsCount: 5, xpReward: 70, order: 5 },
    { id: 3012, title: "Induksi Elektromagnetik", subject: "ipa", grade: 9, description: "Generator dan transformator", questionsCount: 6, xpReward: 75, order: 6 },
    { id: 3013, title: "Bioteknologi", subject: "ipa", grade: 9, description: "Bioteknologi konvensional dan modern", questionsCount: 5, xpReward: 70, order: 7 },
    { id: 3014, title: "Partikel Penyusun Benda", subject: "ipa", grade: 9, description: "Atom, ion, dan molekul", questionsCount: 6, xpReward: 75, order: 8 },
    { id: 3015, title: "Tanah dan Keberlanjutan", subject: "ipa", grade: 9, description: "Komponen tanah dan konservasi", questionsCount: 5, xpReward: 70, order: 9 },
    { id: 3016, title: "Teknologi Ramah Lingkungan", subject: "ipa", grade: 9, description: "Energi terbarukan", questionsCount: 5, xpReward: 70, order: 10 },

    // BAHASA INDONESIA - Kelas 9
    { id: 309, title: "Teks Laporan Percobaan", subject: "bahasa", grade: 9, description: "Struktur dan kebahasaan laporan", questionsCount: 5, xpReward: 70, order: 1 },
    { id: 310, title: "Teks Pidato Persuasif", subject: "bahasa", grade: 9, description: "Menyusun pidato yang meyakinkan", questionsCount: 6, xpReward: 75, order: 2 },
    { id: 311, title: "Teks Cerpen", subject: "bahasa", grade: 9, description: "Unsur intrinsik dan ekstrinsik cerpen", questionsCount: 7, xpReward: 80, order: 3 },
    { id: 312, title: "Teks Tanggapan", subject: "bahasa", grade: 9, description: "Memberikan kritik dan saran", questionsCount: 5, xpReward: 70, order: 4 },
    { id: 3017, title: "Teks Diskusi", subject: "bahasa", grade: 9, description: "Pro dan kontra suatu isu", questionsCount: 6, xpReward: 75, order: 5 },
    { id: 3018, title: "Novel", subject: "bahasa", grade: 9, description: "Analisis novel Indonesia", questionsCount: 5, xpReward: 70, order: 6 },
    { id: 3019, title: "Teks Negosiasi", subject: "bahasa", grade: 9, description: "Struktur negosiasi", questionsCount: 5, xpReward: 70, order: 7 },
    { id: 3020, title: "Teks Editorial", subject: "bahasa", grade: 9, description: "Opini dalam media", questionsCount: 6, xpReward: 75, order: 8 },
    { id: 3021, title: "Resensi", subject: "bahasa", grade: 9, description: "Meresensi buku dan karya", questionsCount: 5, xpReward: 70, order: 9 },
    { id: 3022, title: "Artikel Ilmiah", subject: "bahasa", grade: 9, description: "Menulis artikel populer", questionsCount: 5, xpReward: 70, order: 10 },

    // BAHASA INGGRIS - Kelas 9
    { id: 313, title: "Present Perfect Tense", subject: "english", grade: 9, description: "Pengalaman dan kejadian sampai sekarang", questionsCount: 6, xpReward: 75, order: 1 },
    { id: 314, title: "Passive Voice", subject: "english", grade: 9, description: "Kalimat aktif dan pasif", questionsCount: 5, xpReward: 70, order: 2 },
    { id: 315, title: "Procedure Text", subject: "english", grade: 9, description: "Menulis langkah-langkah", questionsCount: 6, xpReward: 75, order: 3 },
    { id: 316, title: "Report Text", subject: "english", grade: 9, description: "Menjelaskan fenomena umum", questionsCount: 5, xpReward: 70, order: 4 },
    { id: 3023, title: "Advertisement", subject: "english", grade: 9, description: "Iklan dalam bahasa Inggris", questionsCount: 5, xpReward: 70, order: 5 },
    { id: 3024, title: "Announcement", subject: "english", grade: 9, description: "Pengumuman resmi", questionsCount: 5, xpReward: 70, order: 6 },
    { id: 3025, title: "Label", subject: "english", grade: 9, description: "Membaca label produk", questionsCount: 6, xpReward: 75, order: 7 },
    { id: 3026, title: "Caution", subject: "english", grade: 9, description: "Peringatan dan larangan", questionsCount: 5, xpReward: 70, order: 8 },
    { id: 3027, title: "Fairy Tale", subject: "english", grade: 9, description: "Dongeng berbahasa Inggris", questionsCount: 6, xpReward: 75, order: 9 },
    { id: 3028, title: "Short Functional Text", subject: "english", grade: 9, description: "Teks fungsional pendek", questionsCount: 5, xpReward: 70, order: 10 },
];

export default lessons;
