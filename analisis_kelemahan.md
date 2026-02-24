# Laporan Analisis Kelemahan Proyek & Performa Web

Berdasarkan hasil pemindaian dan peninjauan kode sumber secara mendalam pada aplikasi portofolio ini (berbasis Next.js), berikut adalah kelemahan-kelemahan sistem yang berhasil diidentifikasi yang mencakup aspek kerentanan (*vulnerability*), performa web, beban halaman (*web weight*), serta kualitas infrastruktur jaringan dan kode.

---

## 1. Kerentanan Dependensi (Vulnerability)
Pengecekan menggunakan *Package Manager Audit* (`pnpm audit`) menemukan **6 kerentanan keamanan** pada paket pihak ketiga (dependencies) dengan rincian:
- **3 Kerentanan Tingkat Tinggi (High Severity)**
- **3 Kerentanan Tingkat Menengah (Moderate Severity)**

**Dampak:** 
Pustaka yang memiliki kelemahan berisiko menjadi celah eksploitasi oleh pihak tak bertanggung jawab (seperti *Prototype Pollution* atau *Cross-Site Scripting (XSS)* dari library lama).

**Rekomendasi:** 
Lakukan pembaruan paket dengan menjalankan `pnpm update` dan periksa detailnya dengan `pnpm audit` untuk memperbaiki celah pada paket yang terjangkit.

---

## 2. Kelemahan Performa dan Kecepatan Web (Web Speed & Weight)

Aplikasi portofolio ini memiliki struktur "OS Desktop" dengan animasi dan utilitas yang sangat interaktif. Namun, ada beberapa kendala serius terkait performa dan beban web (ukuran awal yang diunduh pengguna):

### a. Tidak Ada Optimasi Gambar (Unoptimized Images)
Sistem mendeteksi bahwa beberapa komponen penting masih menggunakan tag HTML standar `<img>` alih-alih memanfaatkan `<Image />` bawaan Next.js. Hal ini ditemukan pada:
- `PhotoBoothApp.tsx`
- `MusicApp.tsx`
- `AppleIcon.tsx`

**Dampak:** 
Penggunaan `<img>` membuat gambar tidak di-compress secara otomatis menjadi format modern (seperti WebP/AVIF), dan tidak memiliki fitur *lazy-loading*. Akibatnya, memori/kuota pengguna atau berat web akan "bengkak" karena gambar di-load dengan resolusi penuh seketika.

### b. Absennya *Code Splitting* (Lazy Loading Komponen Lanjutan)
Proyek ini menggunakan banyak pustaka berat seperti:
- `framer-motion` (untuk animasi mutakhir)
- `react-rnd` (untuk fitur geser dan ubah ukuran jendela / drag & drop)
- `lucide-react` (untuk ikon UI)

Hasil inspeksi kode sama sekali tidak menemukan pemanggilan fungsi `dynamic(...)` atau fitur *Code Splitting* (lazy load) dari Next.js (`next/dynamic`). 

**Dampak:**
Bundle JavaScript utama (*main chunk*) akan menjadi sangat berukuran raksasa (*heavy payload*). Saat pengguna pertama kali memuat web, mereka harus menunggu seluruh logika aplikasi OS diunduh sebelum halaman bisa berinteraksi penuh, yang akan menurunkan **Tingkat Refresh** dan memperlambat **Time to Interactive (TTI)**.

---

## 3. Kelemahan Jaringan dan Konfigurasi Keamanan (Network & Config)

### a. Absennya *Security Headers* (HTTP Headers Keamanan)
Pada konfigurasi Next.js (`next.config.ts`), sistem tidak mendeteksi adanya pengaturan Header keamanan (*Security Headers*) secara mutlak (seperti *Content Security Policy*, *X-Frame-Options*, tipe data proteksi MIME).

**Dampak:** 
Secara jaringan, kurangnya keamanan header membuat *portofolio* Anda berpotensi disematkan di dalam halaman web penipu menggunakan iframe (disebut *Clickjacking*), di mana interaksi pada UI "OS-Mirip Mac" bisa dibajak.

### b. Strategi Pengambilan Data (Data Fetching)
Kode sumber aplikasi tidak menggunakan fungsi pemanggilan API seperti `fetch()` atau `axios`—semua direktori sistem dan informasi mengandalkan data statis dari map `src/data/` secara langsung.
- **Nilai Positif:** Sangat aman dari kerentanan umum yang melibatkan Injeksi SQL atau *Server-Side Request Forgery* (SSRF).
- **Kelemahan Operasional:** Kecepatan web berisiko statis sepenuhnya, dan jika Anda ingin menambahkan sinkronisasi dinamis (seperti "Jumlah Pengunjung"), aplikasi tidak memiliki kerangka kerja pencegahan kesalahan (error boundary handling) jaringan sama sekali.

---

## 4. Kelemahan Kualitas Kode (Code Level)

- **Kompleksitas DOM yang Berpotensi Berat (DOM Depth):** 
Karena pola "Desktop Windows", React harus me-render dan memantau lusinan div (jendela-jendela yang di-minimize, wallpaper, taskbar). Apabila state seperti koordinat mouse atau *resize properties* di-handle langsung di root-state aplikasi, setiap gerakan (drag) bisa memicu re-render ulang massal di seluruh DOM yang menyebabkan *lag / frame drop* jika dijalankan pada perangkat mobile yang spesifikasinya rendah.
- **Peringatan Linter:** Sistem menemukan beberapa peringatan *Linter* ketika dilakukan simulasi proses build yang menandakan gaya kode yang harus diperketat, demi mencegah kebocoran state atau bug rendering di masa depan.

---

## Kesimpulan & Langkah Darurat

Keseluruhan web Anda sangat elegan secara estetika dan terkesan modern. Namun, di bawah permukaan, ketiadaan implementasi **optimasi aset dan manajemen memori (code-splitting)** menempatkan aplikasi ini ke dalam kategori: **Tingkat Beban Awal Berat (Heavy Load PWA / SPA).**

**Rencana Perbaikan Prioritas:**
1. Mengubah seluruh `<img>` menjadi `import Image from 'next/image'`.
2. Melakukan import secara delay (`lazy`) untuk jendela aplikasi (`Game App`, `Photo Booth App`, dll.) dengan memakai komponen bawaan tipe `dynamic(() => import(...))`.
3. Memastikan package manager telah diperbarui (resolve 6 vulnerabilities tadi).
