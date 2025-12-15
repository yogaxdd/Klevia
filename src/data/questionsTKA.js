// Questions for TKA (Tes Kemampuan Akademik) - Grade 12 Only
// Source: Pusmendik scraped questions
// Premium feature
// Note: true_false questions without options are skipped as they are not compatible with the app format

const questionsTKA = {
    // ============================================
    // TKA MATEMATIKA - 15 soal dari Pusmendik
    // ============================================
    120001: [
        // Soal 1: SPLDV
        {
            question: "Harga 3 buah buku dan 2 buah penggaris Rp18.000,00. Jika harga sebuah buku Rp1.000,00 lebih mahal dari sebuah penggaris, harga 2 buah buku dan 5 buah penggaris adalah ....",
            options: ["Rp19.000,00", "Rp23.000,00", "Rp25.000,00", "Rp27.000,00", "Rp30.000,00"],
            correctAnswer: 1,
            questionImages: [],
            explanation: "3B + 2P = 18.000, B = P + 1.000. Substitusi: 5P + 3.000 = 18.000 → P = 3.000, B = 4.000. Maka 2B + 5P = 8.000 + 15.000 = Rp23.000,00"
        },
        // Soal 2: Program Linear
        {
            question: "Daerah yang memenuhi sistem pertidaksamaan linear adalah ....",
            options: ["I", "II", "III", "IV", "V"],
            correctAnswer: 3,
            questionImages: [
                "/downloaded_images/95089_d25340b2a7ed58e850e0298630c96c79.png",
                "/downloaded_images/88819_6837a3202add4799943b1f2837c58003.png"
            ],
            explanation: "Berdasarkan analisis grafik sistem pertidaksamaan linear"
        },
        // Soal 3: Invers Fungsi
        {
            question: "Diketahui fungsi f(x) dengan domain tertentu. Jika f⁻¹(x) adalah invers dari fungsi f(x), nilai dari f⁻¹(3) = ....",
            options: ["6", "3", "", "", "-1"],
            correctAnswer: 4,
            questionImages: [
                "/downloaded_images/90318_c60ef3ace5c263099625b4010816a4d6.png",
                "/downloaded_images/90318_2a36cdc3b7f69c96b64c46de15d93cba.png"
            ],
            optionImages: [null, null, "/downloaded_images/90318_46f958d9049ce63426b88d5d95566247.png", "/downloaded_images/90318_0023d56d4147d6d42f218fe65a9239a3.png", null],
            explanation: "Dengan substitusi y = f(x), kemudian mencari x = f⁻¹(y), nilai f⁻¹(3) = -1"
        },
        // Soal 4: Fungsi Komposisi
        {
            question: "Fungsi f : R → R dan g : R → R. Jika g(x) = x - 1 dan (f ∘ g)(x) = x³ – 4x, nilai dari f(2) = ….",
            options: ["9", "13", "15", "17", "25"],
            correctAnswer: 2,
            questionImages: [],
            explanation: "f(g(x)) = x³ - 4x. Jika g(x) = x-1, maka f(x) = (x+1)³ - 4(x+1). f(2) = 3³ - 4(3) = 27 - 12 = 15"
        },
        // Soal 5: Barisan Bakteri
        {
            question: "Seorang peneliti melakukan pengamatan terhadap bakteri tertentu. Setiap hari bakteri membelah diri menjadi dua. Pada awal pengamatan terdapat 2 bakteri. Jika setiap 2 hari 1/4 dari jumlah bakteri mati, banyaknya bakteri setelah tiga hari adalah....",
            options: ["48 bakteri", "64 bakteri", "96 bakteri", "128 bakteri", "192 bakteri"],
            correctAnswer: 0,
            questionImages: [
                "/downloaded_images/67173_421b5ddd9a615c99017cadb0f23594f5.png",
                "/downloaded_images/67173_7d34d2ec1b5adb5d52018be3dd4f536b.png"
            ],
            explanation: "Perhitungan dengan pola pertumbuhan bakteri"
        },
        // Soal 6: Volume Kotak Maksimum
        {
            question: "Dari selembar karton berbentuk persegi yang berukuran sisi 30 cm akan dibuat kotak tanpa tutup, dengan cara menggunting empat persegi di setiap pojok karton. Volume kotak terbesar yang dapat dibuat adalah ....",
            options: ["2.000 cm³", "3.000 cm³", "4.000 cm³", "5.000 cm³", "6.000 cm³"],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/62193_925f43a370cc2bcce192c20158ee0776.png"],
            explanation: "V = (30-2x)²·x. Untuk maksimum: dV/dx = 0 → x = 5 cm. V = (30-10)²·5 = 2000 cm³"
        },
        // Soal 7: Trigonometri
        {
            question: "Diketahui sin A = (lihat gambar), A adalah sudut tumpul. Nilai cos A = ….",
            options: ["", "", "", "", ""],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/40142_b2b0e90fe3a7fb9c6dac4483037e80f8.png"],
            optionImages: [
                "/downloaded_images/40142_8f89379a74f84bb7135a6a4cfe93efe8.png",
                "/downloaded_images/40142_90283f302d3db0e305be26ebf7774d94.png",
                "/downloaded_images/40142_8c51847f8f3cffa26b1b63abeb79ad05.png",
                "/downloaded_images/40142_8b77a789f8a25d8af19266963c579ec3.png",
                "/downloaded_images/40142_672a861796e5d4bc135fbc5a1b282873.png"
            ],
            explanation: "Untuk sudut tumpul, cos A negatif. Gunakan identitas sin²A + cos²A = 1"
        },
        // Soal 8: Diagram Batang
        {
            question: "Diagram batang berikut menunjukkan produksi pakaian yang dikelola Bu Rahmi selama tahun 2020 dari bulan Januari sampai bulan Desember. Peningkatan tertinggi jumlah produksi pakaian Bu Rahmi terjadi pada bulan ....",
            options: ["April", "Juni", "Juli", "September", "November"],
            correctAnswer: 3,
            questionImages: ["/downloaded_images/20035_8290fb5c5d179db0ca8d6f0a8a445d0d.png"],
            explanation: "Dari diagram batang, peningkatan tertinggi terlihat terjadi pada bulan September"
        },
        // Soal 9: Modus
        {
            question: "Perhatikan data pada tabel nilai hasil ulangan matematika kelas XI SMA Z. Modus dari data tersebut adalah ....",
            options: ["64,0", "64,5", "65,0", "65,5", "66,0"],
            correctAnswer: 3,
            questionImages: ["/downloaded_images/17865_03efca3015969271cc01dd691c5df6f3.png"],
            explanation: "Modus = Tb + (d1/(d1+d2)) × i. Dari tabel frekuensi, modus = 65,5"
        },
        // Soal 10: Peluang
        {
            question: "Sekolah P akan mengirim 2 perwakilan grup band untuk Pentas Musik Nusantara pada peringatan Hari Sumpah Pemuda. Sekolah tersebut memiliki 6 grup band putra dan 4 grup band putri. Peluang terambil grup band putra pada pengambilan pertama dan grup band putri pada pengambilan kedua adalah ....",
            options: ["", "", "", "", ""],
            correctAnswer: 2,
            questionImages: [],
            optionImages: [
                "/downloaded_images/93353_ba88e2a4dfbcc2652503c8b70fa7d0eb.png",
                "/downloaded_images/93353_074491fe27246e89aa2eac2f8bcf31f8.png",
                "/downloaded_images/93353_139a68813cbdea07eca780390d59ed63.png",
                "/downloaded_images/93353_360ffa720383cf957b4e69cdf09e26b3.png",
                "/downloaded_images/93353_8487725a4d4d086db474b71486a60fe6.png"
            ],
            explanation: "P(putra pertama) × P(putri kedua) = (6/10) × (4/9) = 24/90 = 4/15"
        },
        // Soal 14: Logika Pernyataan
        {
            question: "Putuskan apakah dengan tambahan informasi Pernyataan (1) dan Pernyataan (2) berikut cukup untuk menjawab pertanyaan tersebut! (1) Luas trapesium ABCD = 24. (2) BC = 10 dan CD = 5.",
            options: [
                "Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi Pernyataan (2) SAJA tidak cukup.",
                "Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi Pernyataan (1) SAJA tidak cukup.",
                "DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.",
                "Pernyataan (1) SAJA cukup untuk menjawab pertanyaan dan Pernyataan (2) SAJA cukup.",
                "Pernyataan (1) dan Pernyataan (2) tidak cukup untuk menjawab pertanyaan."
            ],
            correctAnswer: 2,
            questionImages: ["/downloaded_images/67107_be11e2276f265c5b6e2674d8ba2d2c3d.png"],
            explanation: "Kedua pernyataan diperlukan bersama-sama untuk menjawab pertanyaan"
        },
        // Soal 15: Trigonometri Tinggi Dinding
        {
            question: "Tinggi dinding yang disentuh ujung atas tangga adalah ....",
            options: ["3 meter", "3√2 meter", "3√3 meter", "4√2 meter", "4√3 meter"],
            correctAnswer: 2,
            questionImages: ["/downloaded_images/62066_59d3ef955657eaf8f5a160bbd6c2b198.png"],
            explanation: "Menggunakan trigonometri untuk menghitung tinggi dinding"
        },
        // Soal 16: Statistik Nilai Murid (Multiple Answer - pilih salah satu yang paling mungkin benar)
        {
            question: "Tentukan semua pernyataan berikut yang benar terkait dengan nilai ketiga murid yang mengikuti ujian susulan!",
            options: [
                "Jumlah nilai ketiga murid yang mengikuti ujian susulan adalah 229.",
                "Rata-rata nilai ketiga murid yang mengikuti ujian susulan lebih dari 70.",
                "Nilai terendah dari ketiga murid yang mengikuti ujian susulan tidak kurang dari 29.",
                "Nilai tertinggi dari ketiga murid yang mengikuti ujian susulan lebih dari 76.",
                "Jangkauan data nilai ketiga murid yang mengikuti ujian susulan lebih dari dari 72."
            ],
            correctAnswer: 1,
            questionImages: [],
            explanation: "Berdasarkan analisis data statistik"
        },
        // Soal 18: Penggunaan Listrik (Multiple Answer)
        {
            question: "Berdasarkan informasi tersebut, biasanya berapa besar penggunaan listrik di apartemen Andi?",
            options: ["85 kWh", "90 kWh", "100 kWh", "120 kWh", "137 kWh"],
            correctAnswer: 2,
            questionImages: [
                "/downloaded_images/44044_164f5392e1e6f44c3a774f14c12d5e37.png",
                "/downloaded_images/44044_a8a06eb6d7abbbb34dc50b57ab3e11ad.png",
                "/downloaded_images/44044_8942e852504e3643bf634c418ea22ebe.png",
                "/downloaded_images/44044_e631f09a579b3dc314ca01f2f776555c.png"
            ],
            explanation: "Berdasarkan analisis data penggunaan listrik"
        },
        // Soal 20: Kombinasi Kode Akses
        {
            question: "dengan A, B, dan C menyatakan huruf, serta X dan Y menyatakan angka. Tidak boleh ada angka dan huruf yang diulang. Berapakah berapa banyak kode akses berbeda yang dapat dibuat?",
            options: ["1.263.600", "1.352.000", "1.404.000", "1.423.656", "1.757.600"],
            correctAnswer: 2,
            questionImages: ["/downloaded_images/21232_49c208306a27969b494b0ae6af1cdaab.png"],
            explanation: "Perhitungan kombinasi dengan P(26,3) × P(10,2) = 26×25×24 × 10×9"
        }
    ],

    // ============================================
    // TKA BAHASA INDONESIA - 14 soal dari Pusmendik
    // ============================================
    120002: [
        // Soal 1: Makna istilah
        {
            question: "Makna istilah mobilisasi pada paragraf kedua teks tersebut adalah ....",
            options: ["bergerak bersama", "melangkah cepat", "beradu cepat", "mengatur bersama", "berpikir bersama"],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Mobilisasi berasal dari kata 'mobile' yang berarti bergerak."
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
            correctAnswer: 0,
            questionImages: [],
            explanation: "Paragraf pertama umumnya membahas topik utama, yaitu ancaman plastik terhadap lautan."
        },
        // Soal 3: Multiple Answer - Ancaman Lautan
        {
            question: "Mengapa lautan menghadapi ancaman pada 2050? Pilihlah jawaban yang benar!",
            options: [
                "Sampah plastik di laut akan lebih banyak daripada jumlah ikan.",
                "Lautan akan terus mengalami pemanasan dan semakin asam.",
                "Manusia terus memompa lebih banyak CO2 ke atmosfer.",
                "Jumlah ikan yang terancam punah semakin banyak.",
                "Penggunaan plastik terus meningkat dan tidak dikelola dengan baik"
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Sampah plastik merupakan ancaman utama bagi lautan pada 2050."
        },
        // Soal 6: Multiple Answer - Tokoh Iyye
        {
            question: "Apa yang akan terjadi jika tokoh aku tidak datang ke rumah iyye?",
            options: [
                "Iyye akan datang menasehati Ayah karena melarang tokoh aku untuk belajar.",
                "Tokoh aku akan kehilangan kesempatan belajar untuk mengikuti lomba.",
                "Ayah akan tetap melarang tokoh aku untuk belajar dan mengikuti lomba.",
                "Permasalahan tokoh aku dan ayah akan berlarut karena tidak terselesaikan.",
                "Tokoh aku tidak akan bisa fokus untuk belajar dan mengikuti lomba yang diadakan sekolah."
            ],
            correctAnswer: 3,
            questionImages: [],
            explanation: "Permasalahan tokoh aku dan ayah akan berlarut karena tidak terselesaikan."
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
            correctAnswer: 0,
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
            correctAnswer: 3,
            questionImages: [],
            explanation: "Tujuan utama penulis adalah memberikan informasi tentang dampak kesehatan dari Rhodamin B."
        },
        // Soal 9: Pernyataan tentang Rhodamin B
        {
            question: "Pernyataan yang tepat sesuai isi kedua teks tersebut berkaitan dengan Rhodamin B adalah ...",
            options: [
                "Rhodamin B sering disalahgunakan sebagai pewarna makanan karena menawarkan cita rasa yang tinggi.",
                "Rhodamin B berdampak buruk bagi kesehatan, tetapi diperlukan pada industri, seperti tekstil dan kertas.",
                "Rhodamin B berdampak buruk bagi kesehatan, tetapi mudah ditemukan pada kembang gula dan sirup.",
                "Rhodamin B yang berbentuk serbuk kristal dan berwarna hijau digunakan pada industri tekstil dan kertas.",
                "Rhodamin B berdampak buruk bagi kesehatan, meskipun dampak itu baru terlihat beberapa tahun kemudian."
            ],
            correctAnswer: 1,
            questionImages: [],
            explanation: "Pernyataan yang tepat adalah bahwa Rhodamin B berbahaya untuk kesehatan tapi masih digunakan dalam industri."
        },
        // Soal 10: Multiple Answer - Bahaya Rhodamin B
        {
            question: "Mengapa kedua teks tersebut menyebutkan dampak kesehatan yang timbul dari konsumsi pangan yang terkontaminasi Rhodamin B?",
            options: [
                "Mendorong masyarakat untuk menghindari Rhodamin B dalam berbagai keperluan.",
                "Meningkatkan kesadaran masyarakat tentang bahaya Rhodamin B dalam makanan.",
                "Menunjukkan bahwa Rhodamin B aman digunakan dalam industri tekstil dan kertas.",
                "Menjelaskan bahwa Rhodamin B adalah zat berbahaya jika dikonsumsi, terutama dalam jangka panjang.",
                "Memperingatkan masyarakat agar menghindari makanan berwarna mencolok yang berisiko mengandung Rhodamin B."
            ],
            correctAnswer: 1,
            questionImages: [],
            explanation: "Tujuan utama adalah meningkatkan kesadaran masyarakat tentang bahaya Rhodamin B."
        },
        // Soal 11: Bagan bagian penting (dengan gambar)
        {
            question: "Bagan yang tepat untuk menggambarkan bagian-bagian penting dalam teks tersebut adalah ….",
            options: ["", "", "", "", ""],
            correctAnswer: 0,
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
            correctAnswer: 2,
            questionImages: [],
            explanation: "Boyongan dalam bahasa Jawa berarti pindah rumah dengan membawa seluruh keluarga dan barang."
        },
        // Soal 16: Multiple Answer - Karakter Setia Kawan
        {
            question: "Kalimat mana saja dari dalam kutipan cerpen tersebut yang membuktikan karakter sahabat tokoh saya merupakan seorang yang setia kawan?",
            options: [
                "Saya langsung menyatakan ingin ikut, tapi dia keberatan.",
                "Dia memang tidak memiliki banyak pakaian hingga seragam sekolah biasa dipakai kapan saja.",
                "Sahabat saya itu tanggap melingkupi tubuh saya dengan seragam coklatnya.",
                "Dia menggendong saya lalu berlari sembari membujuk-bujuk saya untuk tetap tenang.",
                "Rasa tanggung jawab yang besar seperti memberinya kekuatan berlipat untuk tetap bersama saya."
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "Kalimat yang menunjukkan karakter setia kawan adalah tindakan menolong temannya."
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
            correctAnswer: 1,
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
            correctAnswer: 2,
            questionImages: [],
            explanation: "Kalimat penutup yang tepat harus mendukung argumen positif tentang teknologi hijau."
        },
        // Soal 20: Multiple Answer - Fakta Teknologi Hijau
        {
            question: "Manakah fakta-fakta yang mendukung simpulan bahwa teknologi hijau berperan dalam perubahan iklim?",
            options: [
                "Teknologi hijau merupakan inovasi yang dirancang untuk mengatasi berbagai tantangan lingkungan global, terutama terkait dengan perubahan iklim.",
                "Perubahan iklim, yang dipicu oleh peningkatan emisi gas rumah kaca akibat aktivitas manusia, menyebabkan cuaca ekstrem, suhu global menurun, dan naiknya permukaan air laut.",
                "Teknologi hijau seperti energi terbarukan (tenaga surya, angin) dapat mengurangi ketergantungan pada bahan bakar fosil.",
                "Teknologi hijau juga sangat penting dalam upaya adaptasi terhadap dampak perubahan teknologi yang sudah tidak bisa dihindari.",
                "Melalui teknologi hijau, kita dapat mengurangi dampak negatif terhadap lingkungan dan memperbaiki kualitas hidup."
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "Fakta paling mendukung adalah tentang teknologi hijau yang mengurangi ketergantungan bahan bakar fosil."
        }
    ],

    // ============================================
    // TKA BAHASA INGGRIS - 17 soal dari Pusmendik
    // ============================================
    120003: [
        // Soal 1: Story Outline
        {
            question: "Which of the following outlines shows the correct main points of the story about King Hung Vuong VI?",
            options: [
                "King Hung Vuong VI wanted the best husband for his daughter. Many princes came but none was suitable. Son Tinh and Thuy Tinh both wanted to marry her. The King gave them a test. Thuy Tinh arrived first with the wedding gifts. The princess was given to Thuy Tinh.",
                "King Hung Vuong VI had a beautiful daughter. He announced he was looking for the right husband. Son Tinh and Thuy Tinh appeared and asked to marry her. The King gave them a test with wedding gifts. Son Tinh arrived first and married the princess. Thuy Tinh attacked with floods but was defeated.",
                "King Hung Vuong VI asked his daughter to choose her husband. The princess liked both Son Tinh and Thuy Tinh. The King delayed his decision for many days. Finally, he asked them to fight each other. Thuy Tinh lost the battle and left the land.",
                "King Hung Vuong VI searched for a husband for his daughter. Son Tinh and Thuy Tinh wanted to marry her. The King gave them a challenge. Thuy Tinh lost the test and became angry. He called the waters to rise and destroy the land. Son Tinh drowned in the floods.",
                "The King wanted a nobleman for his daughter. He invited many princes to the palace. Son Tinh and Thuy Tinh competed for the princess. Son Tinh refused the challenge of gifts. The King chose Thuy Tinh as the winner."
            ],
            correctAnswer: 1,
            questionImages: [],
            explanation: "The correct outline describes Son Tinh arriving first and Thuy Tinh attacking with floods after losing."
        },
        // Soal 2: Why Thuy Tinh Attack
        {
            question: "Why did Thuy Tinh attack Son Tinh after the wedding?",
            options: [
                "He was jealous of Son Tinh's victory",
                "He believed the King had lied to him.",
                "He thought the princess loved him more.",
                "He wanted to show off his power to the king.",
                "He had promised to fight until death."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Thuy Tinh was jealous because he lost the competition for the princess."
        },
        // Soal 4: Keep Promise Meaning
        {
            question: "What does the phrase \"kept his promise\" in the text mean?",
            options: [
                "Forgot about his decision.",
                "Changed his mind about the wedding.",
                "Did what he had promised to do.",
                "Delayed the marriage for many days.",
                "The King asked the princes to bring more gifts."
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "\"Kept his promise\" means did what he had promised to do."
        },
        // Soal 5: Main Lesson (Multiple Answer)
        {
            question: "What is the main lesson of the story?",
            options: [
                "Accept defeat gracefully to prevent harm to others.",
                "Be fair and follow the agreed rules in competitions.",
                "Choose peaceful solutions rather than angry reactions.",
                "Prepare honestly and present your gifts properly.",
                "Respect leaders' decisions and community agreements."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The main lesson is about accepting defeat gracefully."
        },
        // Soal 7: Perfect Study Table (Multiple Answer)
        {
            question: "How can we decide a certain table is perfect for studying according to the text?",
            options: [
                "It has good lighting",
                "It provides white noise",
                "It is located near the entrance",
                "It is far from the toilet",
                "It provides stationery"
            ],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/91591_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "Good lighting is essential for a perfect study table."
        },
        // Soal 8: Infographic Target Audience
        {
            question: "Who needs to read this infographic?",
            options: [
                "The students of that school",
                "People who happen to visit the school",
                "The librarian of another school",
                "The headmaster of that school",
                "Parents who come to pick up their kids"
            ],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/92769_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "The infographic is for students of that school."
        },
        // Soal 9: Disrespect Actions (Multiple Answer)
        {
            question: "Which actions show disrespect for other students?",
            options: [
                "Speaking loudly to friends.",
                "Keeping the phone silent.",
                "Eating snacks at the desk.",
                "Playing music in the corner.",
                "Moving chairs noisily."
            ],
            correctAnswer: 0,
            questionImages: ["/downloaded_images/92769_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "Speaking loudly disrespects other students trying to study."
        },
        // Soal 10: Library Visit Preparation
        {
            question: "You find this infographic in front of your school library. What will you do before your next visit to the library?",
            options: [
                "Making sure that I bring my water bottle and lunch with me.",
                "Bringing the books and stationery that I will use.",
                "Organizing the book that I borrowed from the library.",
                "Walking for five minutes so I can focus more when studying.",
                "Making sure you look fresh because you will meet other students."
            ],
            correctAnswer: 1,
            questionImages: ["/downloaded_images/92769_553dcd423e6da03fc4942ea98fcb90d4.png"],
            explanation: "You should bring books and stationery that you will use."
        },
        // Soal 12: Text Main Topic
        {
            question: "The text mainly talks about Bali's …",
            options: [
                "wildlife species and nature lovers",
                "unique cultural treasures and sites.",
                "stunning nature and remarkable sites.",
                "generations and cultural conservation.",
                "scenic beauty and local farming practices."
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "The text mainly discusses Bali's stunning nature and remarkable sites."
        },
        // Soal 13: Natural Beauty Evidence (Multiple Answer)
        {
            question: "Which parts of the text best support the description of Bali as \"full of natural beauty\"?",
            options: [
                "A peaceful area filled with green forests, calm mangrove swamps, and colorful coral reefs along the sea.",
                "These terraces are shaped by generations of farmers who work the land by hand.",
                "Water flows gently over rocky cliffs into a cool, clear pool. Mist rises into the air, mixing with the calming sound of falling water.",
                "In the morning, mist rises above the fields, and sunlight reflects off the water in the paddies.",
                "Farmers in wide-brimmed hats plant rice carefully, their feet sinking into the soft earth."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The description of forests, mangroves, and coral reefs best supports natural beauty."
        },
        // Soal 14: Internship Morning Activities
        {
            question: "During the internship, what did the writer do every morning?",
            options: [
                "Made schedules and explained them to the coaches.",
                "Played football with the team and got the first aid kit.",
                "Prepared a club gift, guided the coaches, and gave t-shirts.",
                "Woke up early, arrived on time, and followed the instructions.",
                "Set up cones, brought water, and checked emergency schedules."
            ],
            correctAnswer: 4,
            questionImages: [],
            explanation: "The writer set up cones, brought water, and checked emergency schedules every morning."
        },
        // Soal 15: Writer's Personality (Multiple Answer)
        {
            question: "What are the best words to describe the writer's personality during the internship?",
            options: [
                "Careful and ready to help",
                "Confident and enjoys working alone",
                "Responsible and willing to learn",
                "Friendly and works well with others",
                "Creative and likes to try new things"
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "The writer was responsible and willing to learn during the internship."
        },
        // Soal 16: After Internship
        {
            question: "What will the writer most likely do after finishing the internship?",
            options: [
                "Considering a career in a sports medicine",
                "Stop working and focus only on school",
                "Look for another chance to work in a sports club",
                "Study medicine to become a doctor",
                "Train as a professional football player"
            ],
            correctAnswer: 2,
            questionImages: [],
            explanation: "The writer will likely look for another chance to work in a sports club."
        },
        // Soal 17: Poor Sleep Effects (Multiple Answer)
        {
            question: "What will happen if teenagers have poor sleep quality?",
            options: [
                "Teenagers' grades could drop.",
                "Teens struggle to focus in class.",
                "Teens are likely to feel stressed.",
                "Teenagers will be more confident",
                "Teens will become mentally strong."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Poor sleep quality can cause grades to drop."
        },
        // Soal 18: Persuasive Facts (Multiple Answer)
        {
            question: "Which of the following additional facts would most likely make the text more persuasive?",
            options: [
                "Research data showing the number of teenagers experiencing anxiety or depression because of social media.",
                "Personal stories from teenagers who feel happier after reducing their social media use.",
                "Statistics about how many teenagers use social media every day.",
                "A list of the most popular social media platforms among teenagers.",
                "Expert opinions from doctors or psychologists about the dangers of social media for mental health."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "Research data about anxiety/depression would make the text more persuasive."
        },
        // Soal 19: Social Media Harm Evidence (Multiple Answer)
        {
            question: "Which statements from the text support the author's argument that social media harms teen mental health?",
            options: [
                "\"When teens see pictures of people who seem perfect, they feel that they are not good enough.\"",
                "\"Many teenagers use their phones late at night, which reduces sleep time and quality.\"",
                "\"Schools should teach students how to use social media in healthy ways.\"",
                "\"Social media helps teens stay connected with friends and learn about interesting topics.\"",
                "\"Victims of cyberbullying often feel alone, scared, and helpless.\""
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The statement about feeling \"not good enough\" supports the harm argument."
        },
        // Soal 20: Main Impression (Multiple Answer)
        {
            question: "What is the most prominent impression you gain from the text about social media?",
            options: [
                "Social media makes teenagers unhappy because they compare their lives to unrealistic images online.",
                "Teenagers should completely stop using social media to protect their mental health.",
                "Using social media too much can disturb teenagers' sleep and make it harder for them to focus at school.",
                "Cyberbullying is a serious problem on social media and can make teenagers feel lonely and scared.",
                "The text explains that social media has only negative effects without any positive sides."
            ],
            correctAnswer: 0,
            questionImages: [],
            explanation: "The main impression is that social media causes unhappiness through unrealistic comparisons."
        }
    ]
};

export default questionsTKA;

