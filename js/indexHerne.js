import weatherHashMap from './icons.js'

const toggleButton = document.getElementById('toggleButton')
const location =  document.getElementById('location');
const feelsLike =  document.getElementById('feelsLike');
const clothing = document.getElementById('clothing');
const weatherIcon =  document.getElementById('WeatherIconSource');
//thank you dara

let herneResponse;
let moonResponse;
let moonSrc = "https://moon-svg.minung.dev/moon.svg?size=250&theme=ray&rotate=0";

let weatherIconReq;
let locationAndTemp;
let feelsLikeReq;

let moonName;
let moonPercentage;

let isToggled = false;

const preloadMoonImage = () => {
    const img = new Image();
    img.src = moonSrc;
};

secret.addEventListener('click', () => {
    window.location.href = "/dus";
    });

    toggleButton.addEventListener('click', () => {
        isToggled = !isToggled;
    
        const forecastContainer = document.getElementById("forecast-container");
    
        if (!isToggled) {
            if (herneResponse !== undefined) { writeWeather(herneResponse); }
            else { getWeather(); }
            document.getElementById('placeholder').style.display = 'none';
            document.getElementById('placeholder1').style.display = 'none';
            clothing.style.display = '';
            forecastContainer.style.display = '';
            changeIcon();
        } else {
            if (moonResponse !== undefined) { writeMoon(moonResponse); }
            else { getMoon(); }
            document.getElementById('placeholder').style.display = '';
            document.getElementById('placeholder1').style.display = '';
            document.getElementById('placeholder').innerHTML = "&nbsp";
            document.getElementById('placeholder1').innerHTML = "&nbsp";
            weatherIcon.src = moonSrc;
            weatherIcon.setAttribute('viewBox', '0 0 32 32');
            clothing.style.display = 'none';
            forecastContainer.style.display = 'none';
            changeIcon();
        }
    });

function changeIcon() {
    let button = document.querySelector('#toggleButton');
    let icon = button.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

const writeMoon = function(data) {
    moonName = data.astronomy.astro.moon_phase;
    moonPercentage = data.astronomy.astro.moon_illumination + '%';
    
    location.innerHTML = moonName;
    feelsLike.innerHTML = moonPercentage;
}

const writeWeather = function(data) {
    weatherIconReq = weatherHashMap[data.list[0].weather[0].id];
    locationAndTemp = 'Herne | ' + Math.round(data.list[0].main.temp) + '&deg;';
    feelsLikeReq = 'Gefühlt ' + Math.round(data.list[0].main.feels_like) + '&deg';      
    
    weatherIcon.src = weatherIconReq;
    location.innerHTML = locationAndTemp;
    feelsLike.innerHTML = feelsLikeReq;

    getClothing(data.list[0].main.temp);
    renderForecast(data.list);
}

function getClothing(temperature) {
    switch(true) {
        case temperature <= 0:    
            clothing.innerHTML = "🥶☔🧥👖🧦🧣🧤🥾👢🍵";
            break;

        case temperature > 0 && temperature <= 14:  
            clothing.innerHTML = "😖☔🧥👖🧣🧦🥾👢";
            break;

        case temperature > 14 && temperature <= 18: 
            clothing.innerHTML = "😐🧥🥾👢👖🧦";
            break;

        case temperature > 18 && temperature <= 24:
            clothing.innerHTML = "😛👟👕👚👖";
            break;

        case temperature > 24 && temperature <= 29:
            clothing.innerHTML = "🥰🍹🧢👕🩳👗🕶️👒👡🩴";
            break;
            
        case temperature > 29:
            clothing.innerHTML = "🥵🧢👙👗🎽🤽🏻🌊👒👡🩴⛱️🏊🏻‍♀️";
            break;   
    }
}

function renderForecast(list) {
    const grouped = groupForecastByDay(list);
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";
  
    Object.keys(grouped).forEach(day => {
      const entries = grouped[day];
      const temps = entries.map(e => e.main.temp);
      const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
      const iconCode = entries[0].weather[0].id;
      const iconUrl = weatherHashMap[iconCode];
  
      const div = document.createElement("div");
      div.className = "forecast-day";
      div.innerHTML = `
        <div>${new Date(day).toLocaleDateString('de-DE', { weekday: 'short' })}</div>
        <img src="${iconUrl}" alt="icon">
        <div>${avgTemp}°</div>
      `;
      div.onclick = () => showDayDetail(entries, day);
      forecastContainer.appendChild(div);
    });
  }

  function groupForecastByDay(list) {
    const grouped = {};
    list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return grouped;
  }

  function showDayDetail(dayData, day) {
    const modal = document.getElementById("forecastModal");
    const body = document.getElementById("modal-body");
  
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const header = new Date(day).toLocaleDateString('de-DE', options);
  
    body.innerHTML = `<h3>${header}</h3><div class="detail-grid">`;
  
    dayData.forEach(entry => {
      const time = entry.dt_txt.split(" ")[1].slice(0, 5);
      const temp = Math.round(entry.main.temp);
      const desc = translateWeather(entry.weather[0].main);
      const icon = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;
  
      body.innerHTML += `
        <div class="detail-row">
          <div class="detail-time">${time}</div>
          <div class="detail-icon"><img src="${icon}" /></div>
          <div class="detail-temp">${temp}°</div>
          <div class="detail-desc">${desc}</div>
        </div>`;
    });
  
    body.innerHTML += `</div>`;
    modal.classList.remove("hidden");
  }
  
  function translateWeather(main) {
    const map = {
        Rain: 'Regen ☔',
        Clouds: 'Wolken ☁️',
        Clear: 'Klar 😊',
        Snow: 'Schnee ❄️',
        Thunderstorm: 'Gewitter ⛈️',
        Drizzle: 'Nieselregen 🌧️',
        Mist: 'Nebel 🌫️',
    };
    return map[main] || main;
  }

const getWeather = function() {
    //weather call
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=51.5368948&lon=7.2009147&exclude=minutely,hourly,daily,alerts&appid=80daf6978b24a949df62669da4146061&units=metric')
    .then((response) => response.json())
    .then((data) => {
        herneResponse = data;
        writeWeather(herneResponse); });
    //moon call
    let utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    fetch('https://api.weatherapi.com/v1/astronomy.json?key=88d21e164d0d49d99a182132231304&q=Herne&dt=' + utc)
    .then((response) => response.json())
    .then((data) => {
        moonResponse = data;});
    }

window.addEventListener('DOMContentLoaded', () => {
    preloadMoonImage();
    getWeather();
})

document.querySelector(".close").onclick = () => {
    document.getElementById("forecastModal").classList.add("hidden");
  };
  
  window.onclick = (event) => {
    const modal = document.getElementById("forecastModal");
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  };
