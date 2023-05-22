// establish global variables
// var iconURL = 'https://openweathermap.org/img/wn/';
// var icon = document.createElement('img');
// icon.setAttribute('src', iconURL + data.weather[0].icon + '.png');
// var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + "&appid=" + APIKey + '&units=metric';

var inputField = document.getElementById("input-field");
var searchButton = document.getElementById("search-button");
var searchForm = document.getElementById("search-form");
var oldSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
var searchHistoryEle = document.getElementById("search-history");
var futureForecast = document.getElementById("future-forecast");
var currentWeatherEl = document.getElementById("current-weather");
const apiKey = "0657e2947af83aaf43aadc579a1a3f99";

//Function to capitalise first letter of search input
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// get the value of the search input.
// this was working but now it isn't ? debug needed
function searchInput() {
  var userSearch = inputField.value;
  inputField.value = "";
  console.log(userSearch);
  if (userSearch === "") {
    alert("Invalid. Please write something in the search field.");
    return;
  }

  getGeoApi(userSearch);
  // This reads, modifies, and puts it back in
}

// use the search value to query the geocode API
// the geocache api link -- http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// I'm not sure if I have to make another html + javascript file to display this?

var getGeoApi = function (cityName) {
  var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data);
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

var getCurrentWeather = function (lat, lon, cityName) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          const array = JSON.parse(
            localStorage.getItem("weatherSearchHistory")
          );
          if (array && !array.includes(cityName.toLowerCase())) {
            array.push(cityName.toLowerCase());
            console.log(`saving ${array} to ls`);
            localStorage.setItem("weatherSearchHistory", JSON.stringify(array));
          } else if (!array) {
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

var getFutureWeather = function (lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(`Unable to connect to OpenWeatherMap: ${error}`);
    });
};

function renderCurrentWeather(data) {
  currentWeatherEl.innerHTML = "";
  currentWeatherEl.innerHTML = `
  <p id="name">${data.name}</p>
  <p id="date">${data.dt}</p>
  <p id="icon">${data.weather[0].icon}</p>
  <p id="temp">${data.main.temp}</p>
  <p id="humidity">${data.main.humidity}</p>
  <p id="wind-speed">${data.wind.speed}</p>
  `;
}

// add the searched city to the search history using localstorage
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

// create one key that will represent the cities that have been searched and its value will be an array of strings -- those strings themselves will be literally the cities searched
// localStorage.setItem("searchHistory", JSON.stringify([]));
// var searchHistory = localStorage.getItem("searchHistory");
// console.log(searchHistory);

// Listeners
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchInput();
});
