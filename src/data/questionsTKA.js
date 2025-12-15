// Questions for TKA (Tes Kemampuan Akademik) - Grade 12 Only
// Source: Pusmendik scraped questions
// Premium feature

const questionsTKA = {
    // TKA MATEMATIKA - Set 1 (10 soal pilihan ganda dari 19 soal Pusmendik)
    120001: [
        // Soal 1: SPLDV - Buku dan Penggaris
        {
            question: "Harga 3 buah buku dan 2 buah penggaris Rp18.000,00. Jika harga sebuah buku Rp1.000,00 lebih mahal dari sebuah penggaris, harga 2 buah buku dan 5 buah penggaris adalah ....",
            options: ["Rp19.000,00", "Rp23.000,00", "Rp25.000,00", "Rp27.000,00", "Rp30.000,00"],
            correctAnswer: 1,
            questionImages: [],
            explanation: "3B + 2P = 18.000, B = P + 1.000. Substitusi: 5P + 3.000 = 18.000 → P = 3.000, B = 4.000. Maka 2B + 5P = 8.000 + 15.000 = Rp23.000,00"
        },
        // Soal 2: Program Linear - Daerah yang memenuhi sistem pertidaksamaan
        {
            question: "Daerah yang memenuhi sistem pertidaksamaan linear adalah ....",
            options: ["I", "II", "III", "IV", "V"],
            correctAnswer: 3, // Daerah IV berdasarkan analisis grafik
            questionImages: [
                "/downloaded_images/95089_d25340b2a7ed58e850e0298630c96c79.png",
                "/downloaded_images/88819_6837a3202add4799943b1f2837c58003.png"
            ],
            explanation: "Berdasarkan analisis grafik sistem pertidaksamaan linear, daerah yang memenuhi adalah daerah IV"
        },
        // Soal 3: Invers Fungsi
        {
            question: "Diketahui fungsi f(x) dengan domain tertentu. Jika f⁻¹(x) adalah invers dari fungsi f(x), nilai dari f⁻¹(3) = ....",
            options: ["6", "3", "(gambar)", "(gambar)", "-1"],
            correctAnswer: 4, // -1
            questionImages: [
                "/downloaded_images/90318_c60ef3ace5c263099625b4010816a4d6.png",
                "/downloaded_images/90318_2a36cdc3b7f69c96b64c46de15d93cba.png"
            ],
            optionImages: [
                null, null,
                "/downloaded_images/90318_46f958d9049ce63426b88d5d95566247.png",
                "/downloaded_images/90318_0023d56d4147d6d42f218fe65a9239a3.png",
                null
            ],
            explanation: "Dengan substitusi y = f(x), kemudian mencari x = f⁻¹(y), nilai f⁻¹(3) = -1"
        },
        // Soal 4: Fungsi Komposisi
        {
            question: "Fungsi f : R → R dan g : R → R. Jika g(x) = x - 1 dan (f ∘ g)(x) = x³ – 4x, nilai dari f(2) = ....",
            options: ["9", "13", "15", "17", "25"],
            correctAnswer: 2, // 15
            questionImages: [],
            explanation: "f(g(x)) = x³ - 4x. Jika g(x) = x-1, maka f(x) = (x+1)³ - 4(x+1). f(2) = 3³ - 4(3) = 27 - 12 = 15"
        },
        // Soal 5: Barisan Bakteri
        {
            question: "Seorang peneliti melakukan pengamatan terhadap bakteri tertentu. Setiap hari bakteri membelah diri menjadi dua. Pada awal pengamatan terdapat 2 bakteri. Jika setiap 2 hari 1/4 dari jumlah bakteri mati, banyaknya bakteri setelah tiga hari adalah....",
            options: ["48 bakteri", "64 bakteri", "96 bakteri", "128 bakteri", "192 bakteri"],
            correctAnswer: 0, // 48 bakteri
            questionImages: [
                "/downloaded_images/67173_421b5ddd9a615c99017cadb0f23594f5.png",
                "/downloaded_images/67173_7d34d2ec1b5adb5d52018be3dd4f536b.png"
            ],
            explanation: "Hari 1: 2×2=4. Hari 2: 4×2=8, mati 1/4 → 6. Hari 3: 6×2=12... (perhitungan dengan pola)"
        },
        // Soal 6: Volume Kotak Maksimum
        {
            question: "Dari selembar karton berbentuk persegi yang berukuran sisi 30 cm akan dibuat kotak tanpa tutup, dengan cara menggunting empat persegi di setiap pojok karton. Volume kotak terbesar yang dapat dibuat adalah ....",
            options: ["2.000 cm³", "3.000 cm³", "4.000 cm³", "5.000 cm³", "6.000 cm³"],
            correctAnswer: 0, // 2.000 cm³
            questionImages: [
                "/downloaded_images/62193_925f43a370cc2bcce192c20158ee0776.png"
            ],
            explanation: "V = (30-2x)²·x. Untuk maksimum: dV/dx = 0 → x = 5 cm. V = (30-10)²·5 = 20²·5 = 2000 cm³"
        },
        // Soal 7: Trigonometri - Sudut Tumpul
        {
            question: "Diketahui sin A = (lihat gambar), A adalah sudut tumpul. Nilai cos A = ....",
            options: ["", "", "", "", ""],
            correctAnswer: 0, // Pilihan pertama berdasarkan analisis
            questionImages: [
                "/downloaded_images/40142_b2b0e90fe3a7fb9c6dac4483037e80f8.png"
            ],
            optionImages: [
                "/downloaded_images/40142_8f89379a74f84bb7135a6a4cfe93efe8.png",
                "/downloaded_images/40142_90283f302d3db0e305be26ebf7774d94.png",
                "/downloaded_images/40142_8c51847f8f3cffa26b1b63abeb79ad05.png",
                "/downloaded_images/40142_8b77a789f8a25d8af19266963c579ec3.png",
                "/downloaded_images/40142_672a861796e5d4bc135fbc5a1b282873.png"
            ],
            explanation: "Untuk sudut tumpul, cos A negatif. Gunakan identitas sin²A + cos²A = 1"
        },
        // Soal 8: Diagram Batang - Peningkatan Produksi
        {
            question: "Diagram batang berikut menunjukkan produksi pakaian yang dikelola Bu Rahmi selama tahun 2020. Peningkatan tertinggi jumlah produksi pakaian Bu Rahmi terjadi pada bulan ....",
            options: ["April", "Juni", "Juli", "September", "November"],
            correctAnswer: 3, // September
            questionImages: [
                "/downloaded_images/20035_8290fb5c5d179db0ca8d6f0a8a445d0d.png"
            ],
            explanation: "Dari diagram batang, peningkatan tertinggi terlihat terjadi pada bulan September"
        },
        // Soal 9: Modus dari Tabel Frekuensi
        {
            question: "Perhatikan data pada tabel nilai hasil ulangan matematika kelas XI SMA Z. Modus dari data tersebut adalah ....",
            options: ["64,0", "64,5", "65,0", "65,5", "66,0"],
            correctAnswer: 3, // 65,5
            questionImages: [
                "/downloaded_images/17865_03efca3015969271cc01dd691c5df6f3.png"
            ],
            explanation: "Modus = Tb + (d1/(d1+d2)) × i. Dari tabel frekuensi, modus = 65,5"
        },
        // Soal 10: Peluang Pengambilan Grup Band
        {
            question: "Sekolah P akan mengirim 2 perwakilan grup band. Terdapat 6 grup band putra dan 4 grup band putri. Peluang terambil grup band putra pada pengambilan pertama dan grup band putri pada pengambilan kedua adalah ....",
            options: ["", "", "", "", ""],
            correctAnswer: 2, // 4/15
            questionImages: [],
            optionImages: [
                "/downloaded_images/93353_ba88e2a4dfbcc2652503c8b70fa7d0eb.png",
                "/downloaded_images/93353_074491fe27246e89aa2eac2f8bcf31f8.png",
                "/downloaded_images/93353_139a68813cbdea07eca780390d59ed63.png",
                "/downloaded_images/93353_360ffa720383cf957b4e69cdf09e26b3.png",
                "/downloaded_images/93353_8487725a4d4d086db474b71486a60fe6.png"
            ],
            explanation: "P(putra pertama) × P(putri kedua) = (6/10) × (4/9) = 24/90 = 4/15"
        }
    ],

    // TKA BAHASA INDONESIA - Set 1 (9 soal pilihan ganda dari 20 soal Pusmendik)
    120002: [
        // Soal 1: Makna istilah
        {
            question: "Makna istilah mobilisasi pada paragraf kedua teks tersebut adalah ....",
            options: ["bergerak bersama", "melangkah cepat", "beradu cepat", "mengatur bersama", "berpikir bersama"],
            correctAnswer: 0, // bergerak bersama
            questionImages: [],
            explanation: "Mobilisasi berasal dari kata 'mobile' yang berarti bergerak. Dalam konteks paragraf, mobilisasi bermakna bergerak bersama."
        },
        // Soal 2: Gagasan utama
        {
            question: "Apa gagasan utama yang disampaikan pada paragraf pertama teks tersebut?",
            options: [
                "Ancaman plastik terhadap lautan.",
                "Efek dari pemanasan laut.",
                "Kadar tingkat keasaman laut.",
                "Pemompaan CO2 ke atmosfer.",
                "Ancaman bagi negara berkembang."
            ],
            correctAnswer: 0, // Ancaman plastik terhadap lautan
            questionImages: [],
            explanation: "Paragraf pertama umumnya membahas topik utama, yaitu ancaman plastik terhadap lautan."
        },
        // Soal 7: Nilai sosial cerpen
        {
            question: "Keterkaitan nilai sosial dalam kutipan cerpen tersebut dengan kehidupan sehari-hari adalah …",
            options: [
                "Masih ditemukan orang tua yang tidak memedulikan pendidikan anaknya demi membantu pekerjaan mereka.",
                "Terbenturnya cita-cita anak karena tradisi sebuah keluarga yang mengutamakan anak mampu bekerja mandiri.",
                "Asumsi bahwa bekerja lebih bermanfaat daripada sekolah yang dianggap tidak menghasilkan apa-apa untuk keluarga.",
                "Kebiasaan anak-anak tidak sekolah di musim maddongi demi menjalankan tradisi di lingkungan keluarga mereka.",
                "Orang tua mengarahkan anak-anak untuk rajin bekerja membantu mereka di sawah agar bisa melanjutkan kehidupannya kelak."
            ],
            correctAnswer: 0, // Masih ditemukan orang tua...
            questionImages: [],
            explanation: "Nilai sosial yang paling tepat adalah tentang orang tua yang kurang memedulikan pendidikan anak."
        },
        // Soal 8: Tujuan penulis
        {
            question: "Tujuan penulis sesuai teks 1 adalah ...",
            options: [
                "Menginformasikan jenis dan rasa makanan yang mengandung Rhodamin B.",
                "Menjelaskan dampak penggunaan Rhodamin B pada bahan-bahan industri.",
                "Mengimbau agar masyarakat tidak menggunakan barang-barang yang mengandung Rhodamin B.",
                "Menginformasikan dampak mengonsumsi makanan yang mengandung Rhodamin B bagi tubuh.",
                "Menjelaskan gejala yang timbul akibat mengkonsumsi makanan yang mengandung Rhodamin B."
            ],
            correctAnswer: 3, // Menginformasikan dampak mengonsumsi...
            questionImages: [],
            explanation: "Tujuan utama penulis adalah memberikan informasi tentang dampak kesehatan dari Rhodamin B."
        },
        // Soal 9: Pernyataan tepat tentang Rhodamin B
        {
            question: "Pernyataan yang tepat sesuai isi kedua teks tersebut berkaitan dengan Rhodamin B adalah ...",
            options: [
                "Rhodamin B sering disalahgunakan sebagai pewarna makanan karena menawarkan cita rasa yang tinggi.",
                "Rhodamin B berdampak buruk bagi kesehatan, tetapi diperlukan pada industri, seperti tekstil dan kertas.",
                "Rhodamin B berdampak buruk bagi kesehatan, tetapi mudah ditemukan pada kembang gula dan sirup.",
                "Rhodamin B yang berbentuk serbuk kristal dan berwarna hijau digunakan pada industri tekstil dan kertas.",
                "Rhodamin B berdampak buruk bagi kesehatan, meskipun dampak itu baru terlihat beberapa tahun kemudian."
            ],
            correctAnswer: 1, // Rhodamin B berdampak buruk... tetapi diperlukan industri
            questionImages: [],
            explanation: "Pernyataan yang tepat adalah bahwa Rhodamin B berbahaya untuk kesehatan tapi masih digunakan dalam industri."
        },
        // Soal 11: Bagan bagian penting (dengan gambar)
        {
            question: "Bagan yang tepat untuk menggambarkan bagian-bagian penting dalam teks tersebut adalah ….",
            options: ["", "", "", "", ""],
            correctAnswer: 0, // Berdasarkan analisis bagan
            questionImages: [],
            optionImages: [
                "/downloaded_images/25068_description.png",
                "/downloaded_images/25068_49ab5357d2bcbdb2bccfaa5f4d128808.png",
                "/downloaded_images/25068_0a1d331f78fb32852fef358c2ce0a1c1.png",
                "/downloaded_images/25068_ee9e5d7c03f2925e48144abb2723c967.png",
                "/downloaded_images/25068_da11f9711461225e3ac115058b1f008d.png"
            ],
            explanation: "Pilih bagan yang paling menggambarkan struktur teks."
        },
        // Soal 14: Kata serapan boyongan
        {
            question: "\"Hampir 25 tahun lalu kami berpisah karena keluarga saya harus boyongan ke kota tempat kerja Ayah yang baru di luar pulau.\" Penggunaan kata serapan boyongan dapat memperjelas peristiwa yang dialami tokoh saya, yaitu ...",
            options: [
                "Peristiwa pindahan yang sering dialami pegawai suatu instansi untuk kepentingan promosi jabatan.",
                "Peristiwa pindah rumah dari kampung halaman ke tempat yang jauh untuk jangka waktu lama.",
                "Pindah rumah bersama seluruh anggota keluarga dengan membawa semua barang rumah tangga.",
                "Pindah rumah untuk mengikuti tugas kedinasan orang tua di tempat baru yang letaknya sangat jauh.",
                "Kegiatan pindah rumah untuk sementara waktu dan akan berpindah lagi ke rumah dinas yang lain."
            ],
            correctAnswer: 2, // Pindah rumah bersama seluruh anggota keluarga...
            questionImages: [],
            explanation: "Boyongan dalam bahasa Jawa berarti pindah rumah dengan membawa seluruh keluarga dan barang."
        },
        // Soal 18: Hubungan makna kalimat
        {
            question: "Hubungan makna antara kalimat (2) dan (3) pada paragraf kedua adalah ….",
            options: [
                "Akibat-sebab yang diperkuat dengan contoh deforestasi dan kerusakan lingkungan",
                "Sebab-akibat yang mengajak pembaca untuk mengambil langkah tegas",
                "Penegasan yang diperinci dengan contoh konkret yang bisa diaplikasikan pembaca",
                "Perbandingan dari dua pandangan terkait dampak negatif deforestasi",
                "Penyimpulan bahwa teknologi hijau merupakan solusi masalah deforestasi"
            ],
            correctAnswer: 1, // Sebab-akibat yang mengajak pembaca...
            questionImages: [],
            explanation: "Hubungan antarkalimat menunjukkan pola sebab-akibat dengan ajakan."
        },
        // Soal 19: Kalimat penutup paragraf
        {
            question: "Kalimat yang tepat untuk mengakhiri uraian pada paragraf keempat adalah …",
            options: [
                "Pada sisi lain, teknologi hijau memunculkan deforestasi dan polusi.",
                "Sehingga dampak negatif lingkungan berdampak pula pada kualitas hidup.",
                "Di samping itu, teknologi hijau dapat menciptakan dunia yang lebih baik untuk generasi yang akan datang.",
                "Di samping itu, bumi yang menggunakan teknologi hijau akan semakin menghadapi tantangan besar.",
                "Jadi, teknologi hijau berperan dalam menghilangnya keanekaragaman hayati."
            ],
            correctAnswer: 2, // Di samping itu, teknologi hijau dapat menciptakan dunia yang lebih baik...
            questionImages: [],
            explanation: "Kalimat penutup yang tepat harus mendukung argumen positif tentang teknologi hijau."
        }
    ]
};

export default questionsTKA;

