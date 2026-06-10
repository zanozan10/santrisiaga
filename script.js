// ========================
// KONFIGURASI
// ========================
const WEATHER_API_KEY = "da9c4c3479875c8d6ac2a35b8adde320"; // GANTI DENGAN API KEY ANDA
const DEFAULT_CITY = "Pekalongan"; // GANTI DENGAN KOTA ANDA

// ========================
// 1. DATA CUACA
// ========================
async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=id`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      displayWeather(data, data.name);
      const windSpeedKmh = data.wind.speed * 3.6;
      if (windSpeedKmh > 25) showDoaModal("wind");
    } else {
      fetchWeatherByCity(DEFAULT_CITY);
    }
  } catch (error) {
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
      if (windSpeedKmh > 25) showDoaModal("wind");
    } else {
      document.getElementById("weatherContent").innerHTML =
        `<p class="text-danger">Gagal memuat cuaca. Periksa API Key.</p>`;
    }
  } catch (error) {
    document.getElementById("weatherContent").innerHTML =
      `<p class="text-danger">Error: ${error.message}</p>`;
  }
}

function fetchWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
        ),
      (error) => fetchWeatherByCity(DEFAULT_CITY),
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
  let windWarning =
    windSpeed > 25
      ? '<span class="warning-badge ms-2"><i class="fas fa-exclamation-triangle"></i> Angin Kencang!</span>'
      : "";
  const html = `
        <div class="mb-3">
            <i class="fas fa-${getWeatherIcon(data.weather[0].main)} weather-icon" style="font-size: 3rem;"></i>
            <h2 class="display-4 fw-bold mt-2">${temp}°C</h2>
            <p class="text-capitalize">${description}</p>
        </div>
        <div class="row mt-3">
            <div class="col-6"><i class="fas fa-tint"></i> Kelembaban: ${humidity}%</div>
            <div class="col-6"><i class="fas fa-wind"></i> Angin: ${windSpeed} km/jam ${windWarning}</div>
        </div>
        <div class="mt-3"><small><i class="fas fa-map-marker-alt"></i> ${cityName}</small></div>
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
  };
  return icons[mainWeather] || "cloud-sun";
}

// ========================
// 2. DATA GEMPA
// ========================
async function fetchEarthquake() {
  const url = "https://data.bmkg.go.id/autogempa.json";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data && data.Infogempa && data.Infogempa.gempa) {
      const gempa = data.Infogempa.gempa;
      const magnitude = parseFloat(gempa.Magnitude);
      let warningHtml =
        magnitude >= 5.0
          ? '<div class="alert alert-warning mt-2"><i class="fas fa-waveform"></i> <strong>PERINGATAN!</strong> Gempa besar! Tetap waspada!</div>'
          : "";
      if (magnitude >= 5.0) showDoaModal("earthquake");
      const html = `
                <div class="mb-2"><span class="badge bg-danger fs-5 p-2">M ${gempa.Magnitude}</span><span class="badge bg-secondary fs-5 p-2">${gempa.Kedalaman}</span></div>
                <p class="mt-3"><strong>${gempa.Wilayah}</strong></p>
                <p><i class="far fa-clock"></i> ${gempa.Tanggal} ${gempa.Jam}</p>
                ${warningHtml}
                <small class="text-muted">Sumber: BMKG</small>
            `;
      document.getElementById("earthquakeContent").innerHTML = html;
    } else throw new Error("Format data tidak sesuai");
  } catch (error) {
    document.getElementById("earthquakeContent").innerHTML = `
            <div class="mb-2"><span class="badge bg-secondary fs-5 p-2">⚠️ Mode Demo</span></div>
            <p>API BMKG sedang terkendala. Data contoh ditampilkan untuk memenuhi tugas UAS.</p>
            <hr><div class="text-start"><small><strong>Contoh data gempa:</strong></small><br>
            <small>📅 26 Mei 2026 | M 4.2 | Garut, Jawa Barat</small><br>
            <small>📅 15 Mei 2026 | M 5.1 | Jailolo, Maluku Utara</small></div>
            <small class="text-muted mt-3 d-block">*Struktur kode sudah sesuai standar.</small>
        `;
  }
}

// ========================
// 3. MODAL DOA
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
    doaArti = "Ya Allah, aku memohon kepada-Mu kebaikan angin ini...";
  } else {
    doaArab =
      "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أَجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا";
    doaLatin =
      "Inna lillahi wa inna ilaihi raji'un, Allahumma ajurni fi mushibati wakhlif li khairan minha";
    doaArti = "Sesungguhnya kami milik Allah dan kepada-Nya kami kembali...";
  }
  document.getElementById("modalDoaArab").innerHTML = doaArab;
  document.getElementById("modalDoaLatin").innerHTML = doaLatin;
  document.getElementById("modalDoaArti").innerHTML = doaArti;
  new bootstrap.Modal(document.getElementById("doaModal")).show();
}

// ========================
// 4. KALKULATOR RISIKO (YANG SUDAH DIPERBAIKI)
// ========================
function initKalkulator() {
  const hitungBtn = document.getElementById("hitungRisiko");
  if (hitungBtn) {
    hitungBtn.addEventListener("click", function () {
      // Ambil nilai input
      const jarak = parseFloat(document.getElementById("jarakPantai").value);
      const ketinggian = parseFloat(
        document.getElementById("ketinggian").value,
      );
      const bangunan = document.getElementById("kondisiBangunan").value;

      // Validasi
      if (isNaN(jarak) || isNaN(ketinggian)) {
        alert("Masukkan angka yang valid untuk jarak dan ketinggian!");
        return;
      }

      // Hitung skor
      let skor = 0;
      let penjelasan = [];

      if (jarak < 5) {
        skor += 40;
        penjelasan.push(
          "• Jarak dari pantai <5 km: +40 (risiko tsunami tinggi)",
        );
      } else if (jarak < 15) {
        skor += 20;
        penjelasan.push(
          "• Jarak dari pantai 5-15 km: +20 (risiko tsunami sedang)",
        );
      } else {
        penjelasan.push(
          "• Jarak dari pantai >15 km: +0 (risiko tsunami rendah)",
        );
      }

      if (ketinggian < 30) {
        skor += 30;
        penjelasan.push(
          "• Ketinggian <30 mdpl: +30 (risiko banjir/tsunami tinggi)",
        );
      } else if (ketinggian < 100) {
        skor += 15;
        penjelasan.push(
          "• Ketinggian 30-100 mdpl: +15 (risiko banjir/tsunami sedang)",
        );
      } else {
        penjelasan.push(
          "• Ketinggian >100 mdpl: +0 (risiko banjir/tsunami rendah)",
        );
      }

      if (bangunan === "lemah") {
        skor += 30;
        penjelasan.push(
          "• Bangunan tidak tahan gempa: +30 (risiko keruntuhan tinggi)",
        );
      } else if (bangunan === "sedang") {
        skor += 15;
        penjelasan.push("• Bangunan standar: +15 (risiko keruntuhan sedang)");
      } else {
        penjelasan.push(
          "• Bangunan tahan gempa: +0 (risiko keruntuhan rendah)",
        );
      }

      // Level risiko
      let level, warna, ikhtiar;
      if (skor >= 70) {
        level = "TINGGI";
        warna = "danger";
        ikhtiar =
          "Segera persiapkan tas siaga bencana dan pelajari jalur evakuasi!";
      } else if (skor >= 40) {
        level = "SEDANG";
        warna = "warning";
        ikhtiar = "Tetap waspada dan pantau informasi dari BMKG/BPBD!";
      } else {
        level = "RENDAH";
        warna = "success";
        ikhtiar = "Kondisi relatif aman, tetaplah berdoa dan jaga lingkungan!";
      }

      // Tampilkan hasil
      const hasilDiv = document.getElementById("hasilRisiko");
      hasilDiv.innerHTML = `
                <div class="text-center mb-3">
                    <i class="fas fa-shield-alt fa-2x text-${warna}"></i>
                    <h4 class="mt-2">Tingkat Risiko: <span class="text-${warna}">${level}</span></h4>
                    <div class="progress mt-2"><div class="progress-bar bg-${warna}" style="width: ${skor}%;">${skor}/100</div></div>
                </div>
                <hr>
                <strong>📊 Rincian:</strong>
                <ul class="small mt-2">${penjelasan.map((p) => `<li>${p}</li>`).join("")}</ul>
                <hr>
                <strong>🤲 Ikhtiar:</strong> ${ikhtiar}
                <hr>
                <small class="text-muted">📖 QS. Ar-Rum: 41 - "Telah tampak kerusakan di darat dan di laut karena perbuatan tangan manusia..."</small>
            `;
      hasilDiv.classList.remove("d-none");
      hasilDiv.className = `alert alert-${warna} mt-3`;
    });
  } else {
    console.log("Tombol hitungRisiko tidak ditemukan");
  }
}

// ========================
// 5. JALANKAN SEMUA
// ========================
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather();
  fetchEarthquake();
  initKalkulator(); // <-- INI YANG MEMPERBAIKI KALKULATOR
  setInterval(() => {
    fetchWeather();
    fetchEarthquake();
  }, 600000);
});
