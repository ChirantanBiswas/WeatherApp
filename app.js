//Api and other consts

const myApi = {
  /****Please use your own Api key if you're using or referencing this code****/
  // key: "24d26e86cc84b567c2140ceb9c8a7861",
  //key: "a96c6ddffc293b193bc2192c8f7c16e0",
  //6cba147a533ec42d506a35107872ae55
  key: "6cba147a533ec42d506a35107872ae55",
  proxy: "https://cors-anywhere.herokuapp.com/",
};
const KELVIN = 273.15;

//Grabbing the DOM elements

const locationElement = document.querySelector(".place");
const timeElement = document.querySelector(".time");
const weatherIconElement = document.querySelector(".weather-icon");
const descElement = document.querySelector(".weather-description");
const tempElement = document.querySelector(".temperature");
const humidityElement = document.querySelector(".humidity");

//Weather object in which we will store the data from the api and use that later
const weather = {};
weather.temperature = {
  unit: "celsius",
};

//checks if geolocation exists in navigator (browser supports navigation)
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
}

//THROWS AN ERROR WHEN GEOLOCATION DOES NOT WORKS
function showError() {
  alert("Couldnt access your current location");
}

//Setting user's location
function setPosition(position) {
  let myLatitude = position.coords.latitude;
  let myLongitude = position.coords.longitude;

  //   console.log(myLongitude, myLatitude);
  getWeather(myLatitude, myLongitude);
}

//DISPLAYING THE WEATHER TO THE UI
function displayWeather() {
  locationElement.textContent = `${weather.city}, ${weather.country}`;
  weatherIconElement.innerHTML = `<img src="./icons/${weather.iconID}.svg" alt="icon">`;
  descElement.textContent = `${weather.description}`;
  tempElement.innerHTML = `${weather.temperature}<span>°c</span>`;
  humidityElement.innerHTML = `<img class="humidity-icon" src="./extraicons/humidity.svg" alt="humidity">${weather.humidity}`;
}

//GET WEATHER
function getWeather(myLat, myLong) {
  let data1;

  //console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myApi.key}`);

  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myApi.key}`
  );
  request.send();
  request.addEventListener("load", function () {
    data1 = JSON.parse(this.responseText);

    //assignment to weather object keys
    weather.temperature = (data1.main.temp - KELVIN).toFixed(0);
    weather.tempUnit = "celsius";
    weather.description = data1.weather[0].description;
    weather.iconID = data1.weather[0].icon;
    weather.city = data1.name;
    weather.country = data1.sys.country;
    weather.humidity = data1.main.humidity;
    //console.log(weather);

    displayWeather();
  });
  //console.log(data1);
}

// CELSIUS TO FAHRENHEIT CONVERSION
function celsiusToFahrenheit(temp) {
  return (9 / 5) * temp + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
function toggleUnits() {
  if (weather.temperature === undefined) {
    //if the value is undefined then simply come out of the fuction
    return;
  }
  if (weather.tempUnit === "celsius") {
    let fahrenheit = Math.floor(
      celsiusToFahrenheit(weather.temperature)
    ).toFixed(0);
    tempElement.innerHTML = `${fahrenheit}<span>°F</span>`;
    weather.tempUnit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature}<span>°C</span>`;
    weather.tempUnit = "celsius";
  }
}
tempElement.addEventListener("click", toggleUnits);
