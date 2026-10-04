# Project Blueprint: Web Portofolio Interaktif "Blue Archive Casual Tech"

## 1. Identitas & Tech Stack
*   **Pemilik:** Alfha / Fhaa (Mahasiswa Informatika ITK).
*   **Framework Utama:** React (menggunakan Vite).
*   **Styling:** Tailwind CSS.
*   **Icons:** `lucide-react`.
*   **Konsep Desain:** "Blue Archive Casual Tech".
*   **Warna:** Background putih (`bg-slate-50`), aksen biru langit (`text-sky-500`, `bg-sky-500`), dan aksen SSR pink (`border-pink-400`).
*   **Geometri:** Menggunakan *chamfered edges* (sudut miring ala UI Sci-Fi) dengan *custom class* `.clip-chamfered`.

## 2. Struktur Direktori File
Proyek difokuskan pada folder `/src`:
/src
  ├── App.jsx                 (Main Layout & routing komponen)
  ├── index.css               (Tailwind directives & class .clip-chamfered)
  └── /components
       ├── Hero.jsx           (Sapaan dan tombol scroll)
       ├── GachaSkills.jsx    (Sistem gacha dengan rarity warna untuk skill)
       ├── MaintenanceCert.jsx(Tampilan server maintenance dengan timer)
       ├── SectionShell.jsx (Sectionnya)
       ├── Terminal.jsx (Tampilan terminal untuk interaktif)
       └── MomoTalkContact.jsx(Simulasi UI chat untuk kontak)

## 3. Spesifikasi Fitur Utama (Scroll Vertikal)

### A. Hero Section
*   **Teks:** Sapaan "Uhe~ Halo! Saya Alfha." dan sub-judul "Mahasiswa Informatika ITK".
*   **Aksi:** Tombol "Mulai Eksplorasi" untuk *smooth scroll* ke bawah.
*   **Dekorasi:** Animasi *floating* ringan pada elemen siluet 'Halo' abstrak di *background*.

### B. Gacha Skills
*   **Alur:** Tampilkan ikon amplop. Saat diklik, jalankan animasi getar selama 1.5 detik. Setelah itu, *render* deretan kartu *skill*.
*   **Rarity:** Efek *glow* Pink (SSR) untuk Python & JS, dan Biru (Normal) untuk C++.

### C. Maintenance (Sertifikat)
*   **UI:** Layar gelap dengan pita kuning-hitam di sudut (*construction tape*).
*   **Pesan:** "[SERVER MAINTENANCE] Uhe~ Ojisan masih mengumpulkan sertifikat. Kembali lagi nanti... Zzz..."
*   **Fitur:** *Fake timer* yang berdetak statis di angka 99:99:99.

### D. MomoTalk (Kontak)
*   **UI:** Simulasi aplikasi *chat*.
*   **Logika:** User mengirim pesan -> tampil sebagai *chat bubble* di kanan -> muncul "Fhaa is typing..." di kiri selama 2 detik -> muncul *chat bubble* balasan otomatis dari sistem.