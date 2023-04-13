import weatherHashMap from './icons.js'

const toggleButton = document.getElementById('toggleButton')
const location =  document.getElementById('location');
const feelsLike =  document.getElementById('feelsLike');
const clothing = document.getElementById('clothing');
const weatherIcon =  document.getElementById('WeatherIconSource');
//thank you dara
let isToggled = false;

toggleButton.addEventListener('click', () => {
    isToggled = !isToggled;
    
    if (!isToggled) {
        getWeather();
        document.getElementById('test').style.display = 'none';
        document.getElementById('test1').style.display = 'none';
        clothing.style.display = '';
        changeIcon();
    }
    else {
        getMoon();
        document.getElementById('test').style.display = '';
        document.getElementById('test1').style.display = '';
        document.getElementById('test').innerHTML = "&nbsp";
        document.getElementById('test1').innerHTML = "&nbsp";
        weatherIcon.src = 'https://moon-svg.minung.dev/moon.svg?size=250&theme=ray&rotate=0';
        weatherIcon.setAttribute('viewBox', '0 0 32 32');
        location.style.fontSize = '40px';
        clothing.style.display = 'none';
        changeIcon();
    }
});

function changeIcon() {
    var button = document.querySelector('#toggleButton');
    var icon = button.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

const writeMoon = function(data) {
    location.innerHTML = data.astronomy.astro.moon_phase;
    feelsLike.innerHTML = data.astronomy.astro.moon_illumination + '%';
}

const writeWeather = function(data) {       
    weatherIcon.src = weatherHashMap[data.weather[0].id];
    location.innerHTML = 'Herne | ' + Math.round(data.main.temp) + '&deg;';
    feelsLike.innerHTML = 'Feels like ' + Math.round(data.main.feels_like) + '&deg;';

    getClothing(data.main.temp);
}

const getClothing = function(temperature) {
    switch(true) {
        case temperature <= 0:    
            clothing.innerHTML = '🥶☔🧥👖🧦🧣🧤🥾👢🍵';
            break;

        case temperature > 0 && temperature <= 13:  
            clothing.innerHTML = '😖☔🧥👖🧣🧦🥾👢';
            break;

        case temperature > 14 && temperature <= 18: 
            clothing.innerHTML = '😐🧥🥾👢👖🧦';
            break;

        case temperature > 19 && temperature <= 24:
            clothing.innerHTML = '😛👟👕👚👖';
            break;

        case temperature > 25 && temperature <= 29:
            EL_CLOclothingTHING.innerHTML = '🥰🍹🧢👕🩳👗🕶️👒👡🩴';
            break;
            
        case temperature > 30:
            clothing.innerHTML = '🥵🧢👙👗🎽🤽🏻🌊👒👡🩴⛱️🏊🏻‍♀️';
            break;   
    }
}

const getWeather = function() {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=51.5368948&lon=7.2009147&exclude=minutely,hourly,daily,alerts&appid=80daf6978b24a949df62669da4146061&units=metric')
    .then((response) => response.json())
    .then((data) => writeWeather(data));
}

const getMoon = function() {
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    fetch('http://api.weatherapi.com/v1/astronomy.json?key=88d21e164d0d49d99a182132231304&q=Herne&dt=' + utc)
    .then((response) => response.json())
    .then((data) => writeMoon(data));
}

window.addEventListener('DOMContentLoaded', () => {
    getWeather()
})
