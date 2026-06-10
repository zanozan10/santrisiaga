// ========================
// KONFIGURASI
// ========================
// DAFTAR DULU DI https://openweathermap.org/api (GRATIS)
// GANTI API_KEY_INI dengan API key milik Anda
const WEATHER_API_KEY = "da9c4c3479875c8d6ac2a35b8adde320"; // <--- GANTI INI!
const CITY = "Jakarta"; // Bisa ganti kota asal Anda

// ========================
// 1. AMBIL DATA CUACA
// ========================
async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=id`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
      // CEK ANGIN KENCANG (kecepatan > 25 km/jam)
      const windSpeedKmh = data.wind.speed * 3.6;
      if (windSpeedKmh > 25) {
        showDoaModal("wind");
      }
    } else {
      document.getElementById("weatherContent").innerHTML =
        `<p class="text-danger">Gagal memuat cuaca. Cek API Key.</p>`;
    }
  } catch (error) {
    document.getElementById("weatherContent").innerHTML =
      `<p class="text-danger">Error: ${error.message}</p>`;
  }
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = (data.wind.speed * 3.6).toFixed(1); // km/jam
  const description = data.weather[0].description;
  const cityName = data.name;

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
            <small><i class="fas fa-map-marker-alt"></i> ${cityName}, Indonesia</small>
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
  };
  return icons[mainWeather] || "cloud-sun";
}

// ========================
// 2. AMBIL DATA GEMPA (BMKG)
// ========================
async function fetchEarthquake() {
  const url = "https://data.bmkg.go.id/autogempa.json";

  try {
    const response = await fetch(url);
    const data = await response.json();
    const gempa = data.Infogempa.gempa;

    const magnitude = parseFloat(gempa.Magnitude);
    const kedalaman = gempa.Kedalaman;
    const lokasi = gempa.Wilayah;
    const waktu = gempa.Tanggal + " " + gempa.Jam;

    let warningHtml = "";
    if (magnitude >= 5.0) {
      warningHtml =
        '<div class="alert alert-warning mt-2"><i class="fas fa-waveform"></i> <strong>PERINGATAN!</strong> Gempa berkekuatan besar. Tetap waspada!</div>';
      // Trigger juga doa untuk gempa besar
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
            <small class="text-muted">Sumber: BMKG | Update Real-time</small>
        `;
    document.getElementById("earthquakeContent").innerHTML = html;
  } catch (error) {
    document.getElementById("earthquakeContent").innerHTML =
      `<p class="text-danger">Gagal memuat data gempa. Coba lagi nanti.</p>`;
  }
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
    // Doa untuk gempa / musibah
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
// 4. JALANKAN SEMUA SAAT HALAMAN LOAD
// ========================
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather();
  fetchEarthquake();

  // Refresh setiap 5 menit (300000 ms)
  setInterval(() => {
    fetchWeather();
    fetchEarthquake();
  }, 300000);
});
