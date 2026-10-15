# 🌙 SantriSiaga - Aplikasi Web Mitigasi Bencana Berbasis Al-Qur'an

![Status](https://img.shields.io/badge/status-Live-success)
![Platform](https://img.shields.io/badge/platform-Web-blue)
![Mata Kuliah](https://img.shields.io/badge/mata%20kuliah-Islam%20%26%20Saintek-green)

> **Implementasi Techno-Pedagogy dalam Mitigasi Bencana: Integrasi Data Real-time BMKG dan OpenWeatherMap dengan Nilai-nilai Al-Qur'an**

Aplikasi web deteksi bencana real-time yang mengintegrasikan sains, teknologi, dan nilai-nilai Islam. Dibuat sebagai **Tugas UAS Mata Kuliah Islam & Saintek Semester 6**.

---

## 🔗 Link Aplikasi

**Akses web secara langsung:**
👉 **[https://zanozan10.github.io/santrisiaga/](https://zanozan10.github.io/santrisiaga/)**

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🌦️ **Deteksi Cuaca Real-time** | Menampilkan suhu, kelembaban, dan kecepatan angin berdasarkan lokasi pengguna (OpenWeatherMap API) |
| 🌍 **Deteksi Gempa Terkini** | Data gempa terbaru dari BMKG (magnitudo, kedalaman, lokasi, waktu) |
| 🤲 **Popup Doa Otomatis** | Doa muncul otomatis saat terdeteksi angin kencang (>25 km/jam) atau gempa besar (M≥5.0) |
| 🧮 **Kalkulator Risiko Bencana** | Fitur interaktif untuk menghitung tingkat risiko berdasarkan jarak pantai, ketinggian, dan kondisi bangunan |
| 📖 **Kajian Edukasi** | QS. Ar-Rum:41 dan Hadits doa angin kencang (HR. Muslim) lengkap dengan Arab, latin, dan terjemahan |
| 📱 **Responsif** | Tampilan rapi dan nyaman diakses dari HP, tablet, maupun desktop |

---

## 🎯 Integrasi Sains, Teknologi, dan Islam

### 🔬 Lapis Sains
- **Meteorologi:** Data cuaca dari satelit dan stasiun bumi (OpenWeatherMap)
- **Geologi:** Data gempa dari sensor BMKG
- **Matematika:** Perhitungan skor risiko bencana

### 💻 Lapis Teknologi
- **HTML5, CSS3, JavaScript** untuk antarmuka interaktif
- **Bootstrap 5** untuk desain responsif
- **Fetch API** untuk integrasi data real-time
- **Geolocation API** untuk deteksi lokasi otomatis

### 🕌 Lapis Islam
- **QS. Ar-Rum (30): 41** — Landasan tentang kerusakan alam akibat ulah manusia
- **HR. Muslim No. 2089** — Doa saat angin kencang
- **Doa Musibah** — Doa saat gempa atau bencana

---

## 🛠️ Teknologi yang Digunakan
Frontend : HTML5, CSS3, JavaScript (Vanilla)
Framework : Bootstrap 5
Icons : Font Awesome 6
Fonts : Poppins (Google Fonts)
API Cuaca : OpenWeatherMap API
API Gempa : BMKG Official API
Hosting : GitHub Pages

---

## 📂 Struktur Proyek
santrisiaga/
├── index.html # Halaman utama (struktur web)
├── style.css # Styling & tampilan
├── script.js # Logika API, kalkulator, dan doa otomatis
└── README.md # Dokumentasi proyek (file ini)
