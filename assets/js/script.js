// Establish global variables.
var inputField = document.getElementById("input-field");
var searchButton = document.getElementById("search-button");
var searchForm = document.getElementById("search-form");
var oldSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
var searchHistoryEle = document.getElementById("search-history");
var forecastCards = document.getElementById("forecast-cards");
var weatherDataEl = document.getElementById("weather-data");
const apiKey = "0657e2947af83aaf43aadc579a1a3f99";

// Get user's location.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getCurrentWeather(latitude, longitude, null);
    getFutureWeather(latitude, longitude);
  });
}

// Function to capitalise first letter of search input.
function capitalizeFirstLetter(string) {
  let stringArray = string.split(" ");
  stringArray = stringArray.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return stringArray.join(" ");
}

// Get the value of the search input.
function searchInput() {
  var userSearch = inputField.value;
  inputField.value = "";
  console.log(userSearch);
  if (userSearch === "") {
    alert("Invalid. Please write something in the search field.");
    return;
  }
  getGeoApi(userSearch);
}

// Getting the latitude and longitude of user search input.
var getGeoApi = function (cityName) {
  var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (!data.length) {
            return;
          }
          getCurrentWeather(data[0].lat, data[0].lon, cityName);
          getFutureWeather(data[0].lat, data[0].lon);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(`Unable to connect to OpenWeatherMap: ${error}`);
    });
};

// Getting the current weather for the city searched.
var getCurrentWeather = function (lat, lon, cityName) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          const array = JSON.parse(
            localStorage.getItem("weatherSearchHistory")
          );
          if (cityName && array && !array.includes(cityName.toLowerCase())) {
            array.unshift(cityName.toLowerCase());
            console.log(`saving ${array} to ls`);
            localStorage.setItem("weatherSearchHistory", JSON.stringify(array));
          } else if (cityName && !array) {
            // if no array
            console.log("else", array);
            localStorage.setItem(
              "weatherSearchHistory",
              JSON.stringify([cityName.toLowerCase()])
            );
          }
          populateSearchHistory();

          renderCurrentWeather(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(`Unable to connect to OpenWeatherMap: ${error}`);
    });
};

// Getting the five day forecast for the user search input.
var getFutureWeather = function (lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data.list);
          // date, icon, temp, wind, humidity
          forecastCards.innerHTML = "";

          for (let i = 0; i < data.list.length; i += 8) {
            const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" />
            <p>Temp: ${data.list[i].main.temp} C</p>
            <p>Humidity: ${data.list[i].main.humidity}%</p>
            <p>Wind Speed: ${data.list[i].wind.speed} kph</p>
            `;
            forecastCards.append(card);
          }
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(`Unable to connect to OpenWeatherMap: ${error}`);
    });
};

// Rendering the current weather to display the appropriate information based on fetched data from the API.
function renderCurrentWeather(data) {
  weatherDataEl.innerHTML = "";
  weatherDataEl.innerHTML = `
  <h2>${data.name}</h2>
  <p id="date">${new Date(data.dt * 1000).toLocaleDateString()}</p>
  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
  <p id="temp">Temperature: ${data.main.temp} C</p>
  <p id="humidity">Humidity: ${data.main.humidity}%</p>
  <p id="wind-speed">Wind Speed: ${data.wind.speed} kph</p>
  `;
}

// Added the searched city to the search history using localstorage.
populateSearchHistory();
function populateSearchHistory() {
  if (localStorage.getItem("weatherSearchHistory")) {
    searchHistoryEle.innerHTML = "";
    const array = JSON.parse(localStorage.getItem("weatherSearchHistory"));

    array.forEach((searchItem) => {
      const button = document.createElement("button");
      button.textContent = capitalizeFirstLetter(searchItem);
      button.addEventListener("click", () => {
        getGeoApi(searchItem);
      });
      searchHistoryEle.append(button);
    });
  }
}

// Listeners listed here.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchInput();
});
