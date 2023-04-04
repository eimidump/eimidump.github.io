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

    setWeatherIcon(data.weather[0].main)
}

var setWeatherIcon = function(weatherName) {
    switch(weatherName) {
        case "Thunderstorm":
            document.getElementById('WeatherIconSource').src = "/Images/thunderstorms-rain.svg";
            break;
    
        case "Drizzle":
            document.getElementById('WeatherIconSource').src = "/Images/drizzle.svg";
            break;
        
        case "Rain":
            document.getElementById('WeatherIconSource').src = "/Images/rain.svg";
            break;
    
        case "Snow":
            document.getElementById('WeatherIconSource').src = "/Images/snow.svg";
            break;
         
        case "Atmosphere":
            document.getElementById('WeatherIconSource').src = "/Images/dust.svg";
            break;
        
        case "Clear":
            document.getElementById('WeatherIconSource').src = "/Images/clear-day.svg";
            break;
    
        case "Clouds":
            document.getElementById('WeatherIconSource').src = "/Images/cloudy.svg";
            break;

        default:
            document.getElementById('WeatherIconSource').src = "/Images/rainbow.png";       // TODO default
            break;
    }
}