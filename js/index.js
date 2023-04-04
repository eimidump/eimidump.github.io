import weatherHashMap from './icons.js'

const EL_LOCATION =  document.querySelector('#location');
const EL_FEELS_LIKE =  document.querySelector('#feelsLike');
const EL_WEATHER_CLOTHING = document.querySelector('#clothing');
const EL_WEATHER_ICON =  document.querySelector('#WeatherIconSource');

const writeWeather = function(data) {        
    EL_WEATHER_ICON.src = weatherHashMap[data.weather[0].id];
    EL_LOCATION.innerHTML = "Herne | " + Math.round(data.main.temp) + '&deg;';
    EL_FEELS_LIKE.innerHTML = "Feels like " + Math.round(data.main.feels_like) + '&deg;';

    getClothing(data.main.temp);
}

const getClothing = function(temperature) {
    switch(true) {
        case temperature <= 0:
            EL_WEATHER_CLOTHING.innerHTML = "🥶☔🧥👖🧦🧣🧤🥾👢🍵";
            break;

        case temperature > 0 && temperature <= 13:
            EL_WEATHER_CLOTHING.innerHTML = "😖☔🧥👖🧣🧦🥾👢";
            break;

        case temperature > 14 && temperature <= 18:
            EL_WEATHER_CLOTHING.innerHTML = "😐🧥🥾👢👖🧦";
            break;

        case temperature > 19 && temperature <= 24:
            EL_WEATHER_CLOTHING.innerHTML = "😛👟👕👚👖";
            break;

        case temperature > 25 && temperature <= 29:
            EL_CLOEL_WEATHER_CLOTHINGTHING.innerHTML = "🥰🍹🧢👕🩳👗🕶️👒👡🩴";
            break;
            
        case temperature > 30:
            EL_WEATHER_CLOTHING.innerHTML = "🥵🧢👙👗🎽🤽🏻🌊👒👡🩴⛱️🏊🏻‍♀️";
            break;   
    }
}

const getWeather = function() {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=51.5368948&lon=7.2009147&exclude=minutely,hourly,daily,alerts&appid=80daf6978b24a949df62669da4146061&units=metric")
    .then((response) => response.json())
    .then((data) => writeWeather(data));
} 

window.addEventListener('DOMContentLoaded', () => {
    getWeather()
})
