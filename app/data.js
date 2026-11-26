// NusaBudget — data: angka resmi BPS + contoh rumah tangga.
// Semua angka BPS di bawah dikutip dari publikasi Badan Pusat Statistik
// (Susenas) dan dicantumkan sumbernya di halaman Sumber. Angka "contoh"
// adalah ilustrasi yang diberi label jelas, bukan data BPS.

export const BPS = {
  // Survei Sosial Ekonomi Nasional (Susenas) Maret 2026, publikasi
  // "Pengeluaran untuk Konsumsi Penduduk Indonesia, Maret 2026"
  // (BPS, dirilis 5 Oktober 2026). Rata-rata pengeluaran per kapita sebulan.
  mar2026: {
    label: 'Susenas Maret 2026',
    total: 1657281,
    foodTotal: 825306,
    nonFoodTotal: 831974,
    food: [
      { name: 'Makanan dan minuman jadi', value: 277302 },
      { name: 'Rokok dan tembakau', value: 94180 },
      { name: 'Padi-padian', value: 92141 },
      { name: 'Sayur-sayuran', value: 65257 },
      { name: 'Ikan, udang, cumi, kerang', value: 63533 },
      { name: 'Telur dan susu', value: 44915 },
      { name: 'Daging', value: 40352 },
      { name: 'Umbi-umbian', value: 10266 },
      // Sisa kelompok makanan (kacang-kacangan, buah-buahan, minyak dan
      // kelapa, bahan minuman, dsb.) = total makanan − kelompok di atas.
      { name: 'Kelompok makanan lainnya', value: 137360, note: 'sisa' },
    ],
    nonFood: [
      { name: 'Perumahan dan fasilitas rumah tangga', value: 424251 },
      { name: 'Aneka barang dan jasa', value: 208038 },
      { name: 'Pajak, pungutan, dan asuransi', value: 68869 },
      { name: 'Barang tahan lama', value: 63462 },
      { name: 'Pakaian, alas kaki, tutup kepala', value: 39908 },
      { name: 'Keperluan pesta dan upacara', value: 27444 },
    ],
  },
  // Susenas Maret 2024, publikasi "Pengeluaran untuk Konsumsi Penduduk
  // Indonesia, Maret 2024" (Vol. 28 No. 1, 2024, Katalog 3201004).
  mar2024: {
    label: 'Susenas Maret 2024',
    total: 1500556,
    foodTotal: 751789,
    nonFoodTotal: 748767,
    foodShare: 50.1,
    nonFoodShare: 49.9,
  },
  // Kontras antarwilayah, Susenas Maret 2024.
  provinces2024: [
    { name: 'DKI Jakarta', foodShare: 39.66, nonFoodShare: 60.34, note: 'paling banyak bukan makanan' },
    { name: 'Indonesia (nasional)', foodShare: 50.1, nonFoodShare: 49.9, note: 'rata-rata nasional' },
  ],
};

// Aturan 50/30/20 — pembagian anggaran yang umum dipakai perencana keuangan.
export const RULE_503020 = [
  { key: 'needs', name: 'Kebutuhan', share: 50, color: '#0e7a5f', desc: 'Makan, rumah, listrik-air, transport, kesehatan, pendidikan, cicilan pokok.' },
  { key: 'wants', name: 'Keinginan', share: 30, color: '#d9930d', desc: 'Jajan, hiburan, langganan streaming, makan di luar, hobi, liburan.' },
  { key: 'savings', name: 'Tabungan & dana darurat', share: 20, color: '#2563eb', desc: 'Dana darurat, tabungan, investasi, bayar utang lebih cepat.' },
];

// Contoh rumah tangga — ILUSTRASI, bukan data BPS. Dipakai kalkulator
// sebagai titik awal yang bisa diubah, dan di halaman Panduan sebagai
// template. Setiap contoh diberi label "Contoh" di situsnya.
export const EXAMPLE_HOUSEHOLDS = [
  {
    id: 'keluarga-muda',
    name: 'Keluarga Muda — Budi & Sari (Jakarta)',
    members: '2 dewasa + 1 anak',
    income: 12000000,
    expenses: [
      { cat: 'Makanan & belanja dapur', amount: 2800000 },
      { cat: 'Sewa rumah / cicilan', amount: 2000000 },
      { cat: 'Listrik, air, internet', amount: 750000 },
      { cat: 'Transport & bensin', amount: 1200000 },
      { cat: 'Pendidikan anak', amount: 900000 },
      { cat: 'Kesehatan', amount: 350000 },
      { cat: 'Jajan & hiburan', amount: 800000 },
      { cat: 'Pakaian & keperluan lain', amount: 400000 },
    ],
    savingsTarget: 1500000,
  },
  {
    id: 'keluarga-4',
    name: 'Keluarga 4 Orang — Agus & Dewi (Bandung)',
    members: '2 dewasa + 2 anak',
    income: 8500000,
    expenses: [
      { cat: 'Makanan & belanja dapur', amount: 2400000 },
      { cat: 'Sewa rumah / cicilan', amount: 1200000 },
      { cat: 'Listrik, air, internet', amount: 550000 },
      { cat: 'Transport & bensin', amount: 900000 },
      { cat: 'Pendidikan anak', amount: 1100000 },
      { cat: 'Kesehatan', amount: 300000 },
      { cat: 'Jajan & hiburan', amount: 450000 },
      { cat: 'Pakaian & keperluan lain', amount: 300000 },
    ],
    savingsTarget: 1000000,
  },
  {
    id: 'lajang',
    name: 'Lajang — Rina (Surabaya)',
    members: '1 dewasa',
    income: 6000000,
    expenses: [
      { cat: 'Makanan & belanja dapur', amount: 1300000 },
      { cat: 'Sewa kos', amount: 1000000 },
      { cat: 'Listrik, air, internet', amount: 300000 },
      { cat: 'Transport & bensin', amount: 600000 },
      { cat: 'Kesehatan', amount: 200000 },
      { cat: 'Jajan & hiburan', amount: 700000 },
      { cat: 'Pakaian & keperluan lain', amount: 250000 },
    ],
    savingsTarget: 1200000,
  },
];

// Target tabungan siap pakai untuk perencana tabungan.
export const SAVING_PRESETS = [
  { id: 'darurat', name: 'Dana darurat 6 bulan', target: 30000000, hint: '6 × pengeluaran bulanan Rp5.000.000' },
  { id: 'dp-rumah', name: 'DP rumah', target: 50000000, hint: 'uang muka rumah subsidi / KPR' },
  { id: 'pendidikan', name: 'Pendidikan anak', target: 25000000, hint: 'biaya masuk sekolah + 1 tahun SPP' },
  { id: 'umroh', name: 'Umroh', target: 35000000, hint: 'biaya perjalanan umroh 1 orang' },
  { id: 'liburan', name: 'Liburan keluarga', target: 10000000, hint: 'liburan 4 orang, 3 hari 2 malam' },
  { id: 'motor', name: 'Motor baru', target: 20000000, hint: 'motor matic baru, tunai' },
];

// Tips hemat yang konkret dan bisa langsung dilakukan.
export const TIPS = [
  { title: 'Catat dulu, baru atur', body: 'Satu minggu catat semua pengeluaran — kebanyakan keluarga kaget melihat pos jajan dan langganan yang tidak terasa.' },
  { title: 'Bayar diri sendiri dulu', body: 'Begitu gajian masuk, langsung pindahkan 20% ke rekening tabungan terpisah sebelum belanja apa pun.' },
  { title: 'Belanja mingguan, bukan harian', body: 'Belanja bahan makanan seminggu sekali dengan daftar belanja memotong belanja impulsif sampai sepertiga.' },
  { title: 'Pisahkan amplop digital', body: 'Satu rekening untuk kebutuhan, satu untuk keinginan, satu untuk tabungan — jangan campur.' },
  { title: 'Cek langganan tiap 3 bulan', body: 'Streaming, aplikasi, dan keanggotaan yang tidak dipakai adalah kebocoran anggaran paling senyap.' },
  { title: 'Dana darurat sebelum investasi', body: 'Siapkan dana darurat 3–6 bulan pengeluaran dulu; investasi tanpa bantalan membuat keluarga panik saat darurat.' },
];
