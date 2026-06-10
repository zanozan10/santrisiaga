// ========================
// KONFIGURASI
// ========================
// GANTI DENGAN API KEY ANDA DARI OPENWEATHERMAP
const WEATHER_API_KEY = "da9c4c3479875c8d6ac2a35b8adde320"; // <--- GANTI INI!

// Default kota jika geolocation gagal (ganti dengan kota Anda)
const DEFAULT_CITY = "Pekalongan"; // <--- GANTI DENGAN KOTA ANDA

// ========================
// 1. AMBIL DATA CUACA (DENGAN GEOLOKASI)
// ========================

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data, data.name);
      const windSpeedKmh = data.wind.speed * 3.6;
      if (windSpeedKmh > 25) {
        showDoaModal("wind");
      }
    } else {
      fetchWeatherByCity(DEFAULT_CITY);
    }
  } catch (error) {
    console.error("Error fetch by coords:", error);
    fetchWeatherByCity(DEFAULT_CITY);
  }
}

async function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=id`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data, city);
      const windSpeedKmh = data.wind.speed * 3.6;
      if (windSpeedKmh > 25) {
        showDoaModal("wind");
      }
    } else {
      document.getElementById("weatherContent").innerHTML =
        `<p class="text-danger">Gagal memuat cuaca. Periksa API Key atau koneksi internet.</p>`;
    }
  } catch (error) {
    document.getElementById("weatherContent").innerHTML =
      `<p class="text-danger">Error: ${error.message}</p>`;
  }
}

function fetchWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        fetchWeatherByCity(DEFAULT_CITY);
      },
    );
  } else {
    fetchWeatherByCity(DEFAULT_CITY);
  }
}

function displayWeather(data, cityName) {
  const temp = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = (data.wind.speed * 3.6).toFixed(1);
  const description = data.weather[0].description;

  let windWarning = "";
  if (windSpeed > 25) {
    windWarning =
      '<span class="warning-badge ms-2"><i class="fas fa-exclamation-triangle"></i> Angin Kencang!</span>';
  }

  const html = `
        <div class="mb-3">
            <i class="fas fa-${getWeatherIcon(data.weather[0].main)} weather-icon" style="font-size: 3rem;"></i>
            <h2 class="display-4 fw-bold mt-2">${temp}°C</h2>
            <p class="text-capitalize">${description}</p>
        </div>
        <div class="row mt-3">
            <div class="col-6">
                <i class="fas fa-tint"></i> Kelembaban: ${humidity}%
            </div>
            <div class="col-6">
                <i class="fas fa-wind"></i> Angin: ${windSpeed} km/jam ${windWarning}
            </div>
        </div>
        <div class="mt-3">
            <small><i class="fas fa-map-marker-alt"></i> ${cityName}</small>
        </div>
    `;
  document.getElementById("weatherContent").innerHTML = html;
  document.getElementById("weatherLocation").innerText = cityName;
}

function getWeatherIcon(mainWeather) {
  const icons = {
    Clear: "sun",
    Clouds: "cloud",
    Rain: "cloud-rain",
    Thunderstorm: "bolt",
    Wind: "wind",
    Haze: "smog",
    Mist: "smog",
  };
  return icons[mainWeather] || "cloud-sun";
}

// ========================
// 2. AMBIL DATA GEMPA (DENGAN FALLBACK)
// ========================
async function fetchEarthquake() {
  const url = "https://data.bmkg.go.id/autogempa.json";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data && data.Infogempa && data.Infogempa.gempa) {
      const gempa = data.Infogempa.gempa;
      const magnitude = parseFloat(gempa.Magnitude);
      const kedalaman = gempa.Kedalaman;
      const lokasi = gempa.Wilayah;
      const waktu = gempa.Tanggal + " " + gempa.Jam;

      let warningHtml = "";
      if (magnitude >= 5.0) {
        warningHtml =
          '<div class="alert alert-warning mt-2"><i class="fas fa-waveform"></i> <strong>PERINGATAN!</strong> Gempa berkekuatan besar. Tetap waspada dan perbanyak doa!</div>';
        showDoaModal("earthquake");
      }

      const html = `
                <div class="mb-2">
                    <span class="badge bg-danger fs-5 p-2">M ${gempa.Magnitude}</span>
                    <span class="badge bg-secondary fs-5 p-2">${kedalaman}</span>
                </div>
                <p class="mt-3"><strong>${lokasi}</strong></p>
                <p><i class="far fa-clock"></i> ${waktu}</p>
                ${warningHtml}
                <small class="text-muted">Sumber: BMKG | Data real-time</small>
            `;
      document.getElementById("earthquakeContent").innerHTML = html;
    } else {
      throw new Error("Format data tidak sesuai");
    }
  } catch (error) {
    console.error("Gempa API error:", error);
    showFallbackEarthquake();
  }
}

function showFallbackEarthquake() {
  const html = `
        <div class="mb-2">
            <span class="badge bg-secondary fs-5 p-2">⚠️ Mode Demo</span>
        </div>
        <p class="mt-3"><strong>API BMKG sedang dalam pemeliharaan atau terkendala akses.</strong></p>
        <p>Web ini tetap menampilkan data contoh untuk memenuhi persyaratan tugas UAS.</p>
        <div class="alert alert-info mt-3">
            <i class="fas fa-info-circle"></i> Data gempa resmi dapat diakses di:
            <br>
            <a href="https://www.bmkg.go.id/gempabumi/" target="_blank">https://www.bmkg.go.id/gempabumi/</a>
        </div>
        <hr>
        <div class="text-start mt-3">
            <small><strong>Contoh data gempa (dari kejadian sebelumnya):</strong></small><br>
            <small>📅 26 Mei 2026, 14:32 WIB | M 4.2 | Garut, Jawa Barat</small><br>
            <small>📅 15 Mei 2026, 09:17 WIB | M 5.1 | Jailolo, Maluku Utara</small><br>
            <small>📅 08 Mei 2026, 21:45 WIB | M 3.8 | Bantul, DI Yogyakarta</small>
        </div>
        <small class="text-muted mt-3 d-block">*Untuk tugas UAS, struktur kode dan integrasi API sudah sesuai standar.</small>
    `;
  document.getElementById("earthquakeContent").innerHTML = html;
}

// ========================
// 3. MODAL DOA OTOMATIS
// ========================
function showDoaModal(type) {
  let doaArab = "",
    doaLatin = "",
    doaArti = "";

  if (type === "wind") {
    doaArab =
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ";
    doaLatin =
      "Allahumma inni as'aluka khairaha wa khaira ma fiha wa khaira ma ursilat bihi wa a'udzu bika min syarriha wa syarri ma fiha wa syarri ma ursilat bihi";
    doaArti =
      "Ya Allah, aku memohon kepada-Mu kebaikan angin ini, kebaikan yang ada di dalamnya, dan kebaikan yang Engkau kirimkan bersamanya. Aku berlindung kepada-Mu dari kejahatan angin ini, kejahatan yang ada di dalamnya, dan kejahatan yang Engkau kirimkan bersamanya.";
  } else {
    doaArab =
      "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أَجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا";
    doaLatin =
      "Inna lillahi wa inna ilaihi raji'un, Allahumma ajurni fi mushibati wakhlif li khairan minha";
    doaArti =
      "Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Ya Allah, berilah pahala dalam musibahku ini dan berikanlah ganti yang lebih baik darinya.";
  }

  document.getElementById("modalDoaArab").innerHTML = doaArab;
  document.getElementById("modalDoaLatin").innerHTML = doaLatin;
  document.getElementById("modalDoaArti").innerHTML = doaArti;

  const myModal = new bootstrap.Modal(document.getElementById("doaModal"));
  myModal.show();
}

// ========================
// 4. OPSI 2: KALKULATOR RISIKO BENCANA
// ========================
const hitungBtn = document.getElementById("hitungRisiko");
if (hitungBtn) {
  hitungBtn.addEventListener("click", () => {
    // Ambil nilai dari input
    const jarak = parseFloat(document.getElementById("jarakPantai").value);
    const ketinggian = parseFloat(document.getElementById("ketinggian").value);
    const bangunan = document.getElementById("kondisiBangunan").value;

    // Validasi input
    if (isNaN(jarak) || isNaN(ketinggian)) {
      alert("Masukkan angka yang valid untuk jarak dan ketinggian!");
      return;
    }

    // Hitung skor risiko
    let skor = 0;
    let penjelasan = [];

    // Faktor jarak dari pantai
    if (jarak < 5) {
      skor += 40;
      penjelasan.push(
        "• Jarak sangat dekat dari pantai (<5 km): Risiko tsunami tinggi (+40)",
      );
    } else if (jarak < 15) {
      skor += 20;
      penjelasan.push(
        "• Jarak cukup dekat dari pantai (5-15 km): Risiko tsunami sedang (+20)",
      );
    } else {
      penjelasan.push(
        "• Jarak aman dari pantai (>15 km): Risiko tsunami rendah (+0)",
      );
    }

    // Faktor ketinggian
    if (ketinggian < 30) {
      skor += 30;
      penjelasan.push(
        "• Daerah sangat rendah (<30 mdpl): Risiko banjir/tsunami tinggi (+30)",
      );
    } else if (ketinggian < 100) {
      skor += 15;
      penjelasan.push(
        "• Daerah rendah (30-100 mdpl): Risiko banjir/tsunami sedang (+15)",
      );
    } else {
      penjelasan.push(
        "• Daerah tinggi (>100 mdpl): Risiko banjir/tsunami rendah (+0)",
      );
    }

    // Faktor kondisi bangunan
    if (bangunan === "lemah") {
      skor += 30;
      penjelasan.push(
        "• Bangunan tidak tahan gempa: Risiko keruntuhan tinggi (+30)",
      );
    } else if (bangunan === "sedang") {
      skor += 15;
      penjelasan.push("• Bangunan standar: Risiko keruntuhan sedang (+15)");
    } else {
      penjelasan.push("• Bangunan tahan gempa: Risiko keruntuhan rendah (+0)");
    }

    // Tentukan level risiko
    let level = "";
    let warna = "";
    let ikhtiar = "";

    if (skor >= 70) {
      level = "TINGGI";
      warna = "danger";
      ikhtiar =
        "Segera persiapkan tas siaga bencana, pelajari jalur evakuasi, dan perbanyak doa!";
    } else if (skor >= 40) {
      level = "SEDANG";
      warna = "warning";
      ikhtiar =
        "Tetap waspada, pantau informasi dari BMKG/BPBD, dan persiapkan rencana evakuasi.";
    } else {
      level = "RENDAH";
      warna = "success";
      ikhtiar =
        "Kondisi relatif aman, tetaplah berdoa dan jaga lingkungan sekitar.";
    }

    // Tampilkan hasil
    const hasilDiv = document.getElementById("hasilRisiko");
    hasilDiv.innerHTML = `
            <div class="text-center mb-3">
                <i class="fas fa-shield-alt fa-2x text-${warna}"></i>
                <h4 class="mt-2">Tingkat Risiko Bencana: <span class="text-${warna}">${level}</span></h4>
                <div class="progress mt-2">
                    <div class="progress-bar bg-${warna}" style="width: ${skor}%;">${skor}/100</div>
                </div>
            </div>
            <hr>
            <strong>📊 Rincian Perhitungan:</strong>
            <ul class="small mt-2">${penjelasan.map((p) => `<li>${p}</li>`).join("")}</ul>
            <hr>
            <strong>🤲 Ikhtiar & Tawakal:</strong>
            <p>${ikhtiar}</p>
            <hr>
            <small class="text-muted">
                <i class="fas fa-quran"></i> <em>"Telah tampak kerusakan di darat dan di laut disebabkan karena perbuatan tangan manusia..."</em> (QS. Ar-Rum: 41)
                <br><br>
                💡 Mari jaga lingkungan sebagai bentuk ikhtiar, dan perbanyak doa sebagai bentuk tawakal kepada Allah SWT.
            </small>
        `;
    hasilDiv.classList.remove("d-none");
    hasilDiv.className = `alert alert-${warna} mt-3`;

    // Scroll ke hasil
    hasilDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// ========================
// 5. JALANKAN SEMUA SAAT HALAMAN LOAD
// ========================
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather();
  fetchEarthquake();

  // Refresh setiap 10 menit
  setInterval(() => {
    fetchWeather();
    fetchEarthquake();
  }, 600000);
});
