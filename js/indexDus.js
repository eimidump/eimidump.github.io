import weatherHashMap from './icons.js';

const toggleButton = document.getElementById('toggleButton');
const locationElement = document.getElementById('location');
const feelsLikeElement = document.getElementById('feelsLike');
const clothingElement = document.getElementById('clothing');
const weatherIconElement = document.getElementById('WeatherIconSource');
const forecastContainer = document.getElementById('forecast-container');
const placeholderElement = document.getElementById('placeholder');
const placeholder1Element = document.getElementById('placeholder1');
const secretElement = document.getElementById('secret');
const forecastModalElement = document.getElementById('forecastModal');
const modalBodyElement = document.getElementById('modal-body');
const closeModalButton = document.querySelector('.close');

let weatherData;
let moonData;
const moonIconSource = 'https://moon-svg.minung.dev/moon.svg?size=250&theme=ray&rotate=0';
let isToggled = false;

const preloadMoonIcon = () => {
  const img = new Image();
  img.src = moonIconSource;
};

secretElement.addEventListener('click', () => {
  window.location.href = '/';
});

toggleButton.addEventListener('click', () => {
  isToggled = !isToggled;

  if (!isToggled) {
    if (weatherData) {
      updateWeatherUI(weatherData);
    } else {
      fetchWeatherData();
    }
    placeholderElement.style.display = 'none';
    placeholder1Element.style.display = 'none';
    clothingElement.style.display = '';
    forecastContainer.style.display = '';
  } else {
    if (moonData) {
      updateMoonUI(moonData);
    } else {
      fetchMoonData();
    }
    placeholderElement.style.display = '';
    placeholder1Element.style.display = '';
    placeholderElement.innerHTML = '&nbsp';
    placeholder1Element.innerHTML = '&nbsp';
    weatherIconElement.src = moonIconSource;
    weatherIconElement.setAttribute('viewBox', '0 0 32 32');
    clothingElement.style.display = 'none';
    forecastContainer.style.display = '';
    forecastContainer.innerHTML = `
      <div class="moon-info">
        <div>🌝 <strong>Nächster Vollmond:</strong> ${getNextFullMoon()}</div>
      </div>
    `;
  }
  toggleIcon();
});

function toggleIcon() {
  const icon = toggleButton.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
}

const updateMoonUI = (data) => {
  const moonPhase = data.astronomy.astro.moon_phase;
  const moonIllumination = data.astronomy.astro.moon_illumination + '%';

  locationElement.innerHTML = moonPhase;
  feelsLikeElement.innerHTML = moonIllumination;
};

const updateWeatherUI = (data) => {
  const weatherId = data.list[0].weather[0].id;
  const weatherIconSrc = weatherHashMap[weatherId];
  const currentTemp = Math.round(data.list[0].main.temp);
  const feelsLikeTemp = Math.round(data.list[0].main.feels_like);

  weatherIconElement.src = weatherIconSrc;
  locationElement.innerHTML = `Düsseldorf | ${currentTemp}&deg;`;
  feelsLikeElement.innerHTML = `Gefühlt ${feelsLikeTemp}&deg`;

  updateClothingRecommendation(currentTemp);
  renderWeatherForecast(data.list);
};

function updateClothingRecommendation(temperature) {
  switch (true) {
    case temperature <= 0:
      clothingElement.innerHTML = '🥶☔🧥👖🧦🧣🧤🥾👢🍵';
      break;
    case temperature > 0 && temperature <= 14:
      clothingElement.innerHTML = '😖☔🧥👖🧣🧦🥾👢';
      break;
    case temperature > 14 && temperature <= 18:
      clothingElement.innerHTML = '😐🧥🥾👢👖🧦';
      break;
    case temperature > 18 && temperature <= 24:
      clothingElement.innerHTML = '😛👟👕👚👖';
      break;
    case temperature > 24 && temperature <= 29:
      clothingElement.innerHTML = '🥰🍹🧢👕🩳👗🕶️👒👡🩴';
      break;
    case temperature > 29:
      clothingElement.innerHTML = '🥵🧢👙👗🎽🤽🏻🌊👒👡🩴⛱️🏊🏻‍♀️';
      break;
    default:
      clothingElement.innerHTML = '';
  }
}

function renderWeatherForecast(forecastList) {
  const dailyForecasts = groupForecastByDay(forecastList);
  forecastContainer.innerHTML = '';

  Object.keys(dailyForecasts).forEach((day) => {
    const entries = dailyForecasts[day];
    const averageTemperature = Math.round(entries.map((e) => e.main.temp).reduce((a, b) => a + b, 0) / entries.length);
    const iconCode = entries[0].weather[0].id;
    const iconUrl = weatherHashMap[iconCode];

    const forecastDayElement = document.createElement('div');
    forecastDayElement.className = 'forecast-day';
    forecastDayElement.innerHTML = `
      <div>${new Date(day).toLocaleDateString('de-DE', { weekday: 'short' })}</div>
      <img src="${iconUrl}" alt="icon">
      <div>${averageTemperature}°</div>
    `;
    forecastDayElement.onclick = () => showDayDetail(entries, day);
    forecastContainer.appendChild(forecastDayElement);
  });
}

function groupForecastByDay(forecastList) {
  const grouped = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (Object.keys(grouped).length >= 5) return;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });
  return grouped;
}

function showDayDetail(dayData, day) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const header = new Date(day).toLocaleDateString('de-DE', options);

  modalBodyElement.innerHTML = `<h3>${header}</h3><div class="detail-grid">`;

  dayData.forEach((entry) => {
    const time = entry.dt_txt.split(' ')[1].slice(0, 5);
    const temp = Math.round(entry.main.temp);
    const description = translateWeatherCode(entry.weather[0].main);
    const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;

    modalBodyElement.innerHTML += `
      <div class="detail-row">
        <div class="detail-time">${time}</div>
        <div class="detail-icon"><img src="${iconUrl}" /></div>
        <div class="detail-temp">${temp}°</div>
        <div class="detail-desc">${description}</div>
      </div>`;
  });

  modalBodyElement.innerHTML += `</div>`;
  forecastModalElement.classList.remove('hidden');
}

function translateWeatherCode(main) {
  const translationMap = {
    Rain: 'Regen ☔',
    Clouds: 'Wolkies ☁️',
    Clear: 'Klar 😊',
    Snow: 'Schnee ❄️',
    Thunderstorm: 'Gewitter ⛈️',
    Drizzle: 'Nieselregen 🌧️',
    Mist: 'Nebel 🌫️',
  };
  return translationMap[main] || main;
}

function getNextFullMoon() {
  const lunarCycleDays = 29.53059;
  const referenceFullMoonDate = new Date('2025-04-13T02:22:00Z');
  const now = new Date();
  let nextFullMoonDate = new Date(referenceFullMoonDate);

  while (nextFullMoonDate <= now) {
    nextFullMoonDate.setDate(nextFullMoonDate.getDate() + lunarCycleDays);
  }

  return formatDateToGerman(nextFullMoonDate);
}

function formatDateToGerman(date) {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}. ${month} ${year} ${hours}:${minutes} Uhr`;
}

const fetchWeatherData = async () => {
  try {
    const weatherResponse = await fetch(
      'https://api.openweathermap.org/data/2.5/forecast?lat=51.22172&lon=6.77616&exclude=minutely,hourly,daily,alerts&appid=80daf6978b24a949df62669da4146061&units=metric'
    );
    weatherData = await weatherResponse.json();
    updateWeatherUI(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

const fetchMoonData = async () => {
  const today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
  try {
    const moonResponse = await fetch(
      `https://api.weatherapi.com/v1/astronomy.json?key=88d21e164d0d49d99a182132231304&q=Dusseldorf&dt=${today}`
    );
    moonData = await moonResponse.json();
    updateMoonUI(moonData);
  } catch (error) {
    console.error('Error fetching moon data:', error);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  preloadMoonIcon();
  fetchWeatherData();
  fetchMoonData();
});

closeModalButton.onclick = () => {
  forecastModalElement.classList.add('hidden');
};

window.onclick = (event) => {
  if (event.target === forecastModalElement) {
    forecastModalElement.classList.add('hidden');
  }
};