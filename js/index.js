import weatherHashMap from './icons.js'

const toggleButton = document.getElementById('toggleButton')
const location =  document.getElementById('location');
const feelsLike =  document.getElementById('feelsLike');
const clothing = document.getElementById('clothing');
const weatherIcon =  document.getElementById('WeatherIconSource');
//thank you dara

let weatherResponse;
let moonResponse;

let weatherIconReq;
let locationAndTemp;
let feelsLikeReq;

let moonName;
let moonPercentage;

let isToggled = false;

toggleButton.addEventListener('click', () => {
    isToggled = !isToggled;
    
    if (!isToggled) {
        if (weatherResponse != 'undefined') { writeWeather(weatherResponse); }
        else { getWeather(); }
        document.getElementById('placeholder').style.display = 'none';
        document.getElementById('placeholder1').style.display = 'none';
        clothing.style.display = '';
        changeIcon();
    }
    else {
        if (moonResponse != 'undefined') { writeMoon(moonResponse); }
        else { getMoon(); }
        document.getElementById('placeholder').style.display = '';
        document.getElementById('placeholder1').style.display = '';
        document.getElementById('placeholder').innerHTML = "&nbsp";
        document.getElementById('placeholder1').innerHTML = "&nbsp";
        weatherIcon.src = 'https://moon-svg.minung.dev/moon.svg?size=250&theme=ray&rotate=0';
        weatherIcon.setAttribute('viewBox', '0 0 32 32');
        clothing.style.display = 'none';
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
    weatherIconReq = weatherHashMap[data.weather[0].id];
    locationAndTemp = 'Herne | ' + Math.round(data.main.temp) + '&deg;';
    feelsLikeReq = 'Seni seviyorum ve özlüyorum';      
    
    weatherIcon.src = weatherIconReq;
    location.innerHTML = locationAndTemp;
    feelsLike.innerHTML = feelsLikeReq;

    getClothing(data.main.temp);
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
            clothing.innerHTML = '😐🧥🥾👢👖🧦';
            break;

        case temperature > 18 && temperature <= 24:
            clothing.innerHTML = '😛👟👕👚👖';
            break;

        case temperature > 24 && temperature <= 29:
            clothing.innerHTML = '🥰🍹🧢👕🩳👗🕶️👒👡🩴';
            break;
            
        case temperature > 29:
            clothing.innerHTML = '🥵🧢👙👗🎽🤽🏻🌊👒👡🩴⛱️🏊🏻‍♀️';
            break;   
    }
}

const getWeather = function() {
    //weather call
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=51.5368948&lon=7.2009147&exclude=minutely,hourly,daily,alerts&appid=80daf6978b24a949df62669da4146061&units=metric')
    .then((response) => response.json())
    .then((data) => {
        weatherResponse = data;
        console.log("weather response" + weatherResponse);
        writeWeather(weatherResponse); });
    //moon call
    let utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    fetch('https://api.weatherapi.com/v1/astronomy.json?key=88d21e164d0d49d99a182132231304&q=Herne&dt=' + utc)
    .then((response) => response.json())
    .then((data) => {
        moonResponse = data;
        console.log("moon data" + moonResponse);});
    }

window.addEventListener('DOMContentLoaded', () => {
    getWeather()
})
