# Analisis Game Center

Setelah melakukan pengecekan mendalam terhadap keseluruhan game yang ada di dalam Game Center (AppleRunner, Blackjack, OrbitFlap, TheStack, TypingTest, dan VirusProtocol), berikut adalah hasil penemuan berupa 3 improvisasi yang bisa diterapkan dan 3 bug yang harus diperbaiki:

## 3 Improvisasi
1. **Penambahan *SoundEngine* ke Semua Game Klasik:** Game seperti AppleRunner, OrbitFlap, dan TheStack saat ini sama sekali tidak memiliki efek suara sentuhan (*feedback*), sehingga terkesan sangat sepi. Improvisasi yang dilakukan adalah mengimplementasikan kelas `SoundEngine` mandiri (seperti yang telah diimplementasikan dengan baik di Blackjack dan VirusProtocol) secara native menggunakan *Web Audio API* untuk memberikan respon audio interaktif (seperti suara lompatan dinosaurus, sirine saat game over, hingga sayap burung).
2. **Dynamic Time Scaling / Framerate Independency:** Pergerakan dan fisika pada game mini belum menggunakan pengukuran *deltaTime*. Mengubah fondasi sistem pergerakan pada seluruh game menjadi berbasis waktu nyata antar-frame akan mengubah nuansa animasi pergerakan menjadi jauh lebih mulus (*smooth*) secara visual.
3. **Peningkatan "Juice" Audio-Visual di TheStack:** Menambahkan improvisasi UI dan *flow* pada TheStack berupa sistem progresi suara. Kami mengimplementasikan variasi efek suara peletakan balok mekanis, serta menambahkan nada yang semakin tinggi (peningkatan *pitch*) dan suara kunci mekanik khusus ketika pemain berhasil menumpuk balok dengan ukuran yang persis sama (mendapatkan *Perfect Hit Bonus*). Hal ini akan sangat meningkatkan dopamin dan *flow* permainan.

---

## 3 Bug yang Ditemukan (Beserta Solusinya)
1. **Bug Sinkronisasi Rintangan (*AppleRunnerDemo*):**
   - **Masalah:** Waktu munculnya rintangan dievaluasi secara acak pada **setiap frame tunggal** setelah batas waktu minimum tercapai (`time - lastSpawn.current > SPAWN_RATE + Math.random() * 1000 - 500`). Akibatnya, esensi dari "kemunculan acak" menjadi rusak total karena fungsi `Math.random` yang dieksekusi 60x++ dalam sedetik tersebut akan memicu *spawn* tepat di batasan waktu paling cepat dan mengakibatkan rintangan menumpuk tebal dan mustahil untuk dilompati.
   - **Solusi:** Melakukan rekayasa pada sistem sela *spawning* dengan mengunci angka *random* di dalam variabel penyintas sementara (misalnya menggunakan state tambahan atau properti di objek yang sedang berevolusi) sehingga delay dihitung di awal kemunculan rintangan, bukan dipertaruhkan per-*tick*.
2. **Fisika Unplayable pada 144Hz Monitor (*OrbitFlapDemo*):**
   - **Masalah:** Gaya gravitasi yang menarik pemain dan pergerakan pipa pilar hanya bertambah secara absolut bergantung pada jumlah frame (`velocity.current += GRAVITY; pipe.x -= PIPE_SPEED;`), yang berarti game akan dirender 2.4x lipat lebih cepat dari seharusnya, berubah menjadi mode ekstrim yang *unplayable* pada monitor 144Hz atau 240Hz dibandingkan dengan standar developer (60Hz).
   - **Solusi:** Menggunakan pengali normalisasi `timeScale` dari parameter `deltaTime` dengan rasio `(deltaTime / 16.66)`, sehingga gravitasi, akselerasi kecepatan, dan lompatan dijamin beroperasi pada kecepatan konstan mutlak, apa pun kapabilitas *refresh rate* layarnya.
3. **Peluncuran Balok Terakselerasi di Monitor Modern (*TheStackDemo*):**
   - **Masalah:** Sama seperti kelemahan di instansi *physics* OrbitFlap, TheStack memperbarui posisi *array* balok yang berjalan secara horizontal (`active.x += speed * active.direction;`) tanpa dipengaruhi kompensasi waktu `deltaTime`. Akibatnya, memotong balok di perangkat canggih dengan frame rate tinggi menyebabkan target tembak bergeser melewati layar seketika, dan *stack* balok melayang keluar pandangan sebelum pemain sempat menekannya.
   - **Solusi:** Memberikan *multiplier timeScale* di setiap baris *game loop* yang melibatkan pemindahan posisi absolut, termasuk kecepatan pergeseran *base* balok `SPEED_BASE`. Ini menjamin agar permainan tetap santai dimainkan sesuai peruntukannya.
