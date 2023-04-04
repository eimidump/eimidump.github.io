const weatherHashMap = new Map();
//Group 2xx: Thunderstorms
weatherHashMap.set(200, "/Images/thunderstorms-rain.svg");
weatherHashMap.set(201, "/Images/thunderstorms-rain.svg");
weatherHashMap.set(202, "/Images/thunderstorms-rain.svg");
weatherHashMap.set(210, "/Images/thunderstorms.svg");
weatherHashMap.set(211, "/Images/thunderstorms.svg");
weatherHashMap.set(212, "/Images/thunderstorms.svg");
weatherHashMap.set(221, "/Images/thunderstorms.svg");
weatherHashMap.set(230, "/Images/thunderstorms-rain.svg");
weatherHashMap.set(231, "/Images/thunderstorms-rain.svg");
weatherHashMap.set(232, "/Images/thunderstorms-rain.svg");
//Group 3xx: Drizzle
weatherHashMap.set(300, "/Images/drizzle.svg");
weatherHashMap.set(301, "/Images/drizzle.svg");
weatherHashMap.set(302, "/Images/drizzle.svg");
weatherHashMap.set(310, "/Images/drizzle.svg");
weatherHashMap.set(311, "/Images/drizzle.svg");
weatherHashMap.set(312, "/Images/drizzle.svg");
weatherHashMap.set(313, "/Images/drizzle.svg");
weatherHashMap.set(314, "/Images/drizzle.svg");
weatherHashMap.set(321, "/Images/drizzle.svg");
//Group 5xx: Rain
weatherHashMap.set(500, "/Images/rain.svg");
weatherHashMap.set(501, "/Images/rain.svg");
weatherHashMap.set(502, "/Images/rain.svg");
weatherHashMap.set(503, "/Images/rain.svg");
weatherHashMap.set(504, "/Images/rain.svg");
weatherHashMap.set(511, "/Images/rain.svg");
weatherHashMap.set(520, "/Images/rain.svg");
weatherHashMap.set(521, "/Images/rain.svg");
weatherHashMap.set(522, "/Images/rain.svg");
weatherHashMap.set(531, "/Images/rain.svg");
//Group 6xx: Snow
weatherHashMap.set(600, "/Images/snow.svg");
weatherHashMap.set(601, "/Images/snow.svg");
weatherHashMap.set(602, "/Images/snow.svg");
weatherHashMap.set(611, "/Images/snow.svg");
weatherHashMap.set(612, "/Images/snow.svg");
weatherHashMap.set(613, "/Images/snow.svg");
weatherHashMap.set(615, "/Images/snow.svg");
weatherHashMap.set(616, "/Images/snow.svg");
weatherHashMap.set(620, "/Images/snow.svg");
weatherHashMap.set(621, "/Images/snow.svg");
weatherHashMap.set(622, "/Images/snow.svg");
//Group 7xx: Atmosphere
weatherHashMap.set(701, "/Images/mist.svg");
weatherHashMap.set(711, "/Images/smoke.svg");
weatherHashMap.set(721, "/Images/haze.svg");
weatherHashMap.set(731, "/Images/dust-wind.svg");
weatherHashMap.set(741, "/Images/fog.svg");
weatherHashMap.set(751, "/Images/dust-wind.svg");
weatherHashMap.set(761, "/Images/dust.svg");
weatherHashMap.set(762, "/Images/dust.svg");
weatherHashMap.set(771, "/Images/dust.svg");
weatherHashMap.set(781, "/Images/tornado.svg");
//Group 800: Clear
weatherHashMap.set(800, "/Images/clear-day.svg");
//Group 8xx: Clouds
weatherHashMap.set(801, "/Images/cloudy.svg");
weatherHashMap.set(802, "/Images/cloudy.svg");
weatherHashMap.set(803, "/Images/overcast.svg");
weatherHashMap.set(804, "/Images/overcast.svg");

var getWeather = function() {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=51.5368948&lon=7.2009147&exclude=minutely,hourly,daily,alerts&appid=80daf6978b24a949df62669da4146061&units=metric")
    .then((response) => response.json())
    .then((data) => writeWeather(data));
} 

var writeWeather = function(data) {        
    document.getElementById('location').innerHTML = "Herne | " + Math.round(data.main.temp) + '&deg;';
    document.getElementById('feelsLike').innerHTML = "Feels like " + Math.round(data.main.feels_like) + '&deg;';
    //document.getElementById('description').innerHTML = data.weather[0].main;          //weather name
    //document.getElementById('temp').innerHTML = Math.round(data.main.temp) + '&deg;';             //temperature
    //document.getElementById('minTemp').innerHTML = Math.round(data.main.temp_min) + '&deg;';          //minimum temp
    //document.getElementById('maxTemp').innerHTML = Math.round(data.main.temp_max) + '&deg;';          //maximum temp
    document.getElementById('WeatherIconSource').src = weatherHashMap.get(data.weather[0].id);
    getClothing(data.main.temp);
}

var getClothing = function(temperature) {
    switch(true) {
        case temperature <= 0:
            document.getElementById('clothing').innerHTML = "🥶☔🧥👖🧦🧣🧤🥾👢🍵";
            break;

        case temperature > 0 && temperature <= 10:
            document.getElementById('clothing').innerHTML = "😖☔🧥👖🧣🧦🥾👢";
            break;

        case temperature > 10 && temperature <= 15:
            document.getElementById('clothing').innerHTML = "😐🧥🥾👢👖🧦";
            break;

        case temperature > 15 && temperature <= 20:
            document.getElementById('clothing').innerHTML = "😛👟👕👚👖";
            break;

        case temperature > 20 && temperature <= 24:
            document.getElementById('clothing').innerHTML = "🥰🍹🧢👕🩳👗🕶️👒👡🩴";
            break;
            
        case temperature > 25:
            document.getElementById('clothing').innerHTML = "🥵🧢👙👗🎽🤽🏻🌊👒👡🩴⛱️🏊🏻‍♀️";
            break;   
    }
}