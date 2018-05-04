const API_KEY = 'e0f4b1431fa082dbca9f491fc5e34c90';
const UNITS = 'metric';
const CITY_ID = '3186886';

const WEATHER_API_URI = `https://api.openweathermap.org/data/2.5/weather?APPID=${API_KEY}&units=${UNITS}&id=${CITY_ID}`;

$weatherTile = document.getElementById('weather');

function templateWeatherTile(data) {
  $weatherTile.innerHTML =
    `<span class="ef226">    \\   /    </span> ${data.name}\n` +
    `<span class="ef226">     .-.     </span> <span class="ef226">${data.low}</span>-<span class="ef220">${data.high}</span> °C\n` +
    '<span class="ef226">  ― (   ) ―  </span> <span class="bold">↓</span> <span class="ef190">11</span> km/h\n' +
    '<span class="ef226">     \`-’     </span> 10 km\n' +
    '<span class="ef226">    /   \\    </span> 0.0 mm';

  return $weatherTile;
}



class WeatherController {
  constructor() {}


  fetchWeatherData() {
    return fetch(WEATHER_API_URI)
      .then((response) => response.json())
      .then((data) => {
        return {
          name: data.weather[0].main,
          low: data.main.temp_min,
          high: data.main.temp_max
        }
      });
  }
}


const weatherController = new WeatherController();

weatherController.fetchWeatherData().then((data) => {
  document.body.appendChild(templateWeatherTile(data));
});


