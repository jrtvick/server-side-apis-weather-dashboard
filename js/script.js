// establish global variables
// var iconURL = 'https://openweathermap.org/img/wn/';
// var icon = document.createElement('img');
// icon.setAttribute('src', iconURL + data.weather[0].icon + '.png');
// var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + "&appid=" + APIKey + '&units=metric';

var inputField = document.getElementById("input-field");
var searchButton = document.getElementById("search-button");
var oldSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
var searchHistoryEle = document.getElementById("search-history");
var futureForecast = document.getElementById("future-forecast");
const apiKey = "0657e2947af83aaf43aadc579a1a3f99";

//Function to capitalise first letter of search input
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// get the value of the search input.
// this was working but now it isn't ? debug needed
function searchInput() {
  var userSearch = inputField.value;
  if (userSearch === "") {
    alert("Invalid. Please write something in the search field.");
    return;
  }

  getGeoApi(userSearch);
  // This reads, modifies, and puts it back in
  const array = JSON.parse(localStorage.getItem("weatherSearchHistory"));
  if (array && !array.includes(userSearch)) {
    array.push(userSearch);
    console.log(`saving ${array} to ls`);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(array));

  } else if (!array) {
    // if no array
    console.log('else', array)
    localStorage.setItem("weatherSearchHistory", JSON.stringify([userSearch]));
  }

  console.log(userSearch);
}

// use the search value to query the geocode API
// the geocache api link -- http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// I'm not sure if I have to make another html + javascript file to display this?

var getGeoApi = function (cityName) {
  var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          getCurrentWeather(data[0].lat, data[0].lon);
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

var getCurrentWeather = function (lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
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
          console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert(`Unable to connect to OpenWeatherMap: ${error}`);
    });
};

// use the latitude and longitude data from the geocode API to query the current weather API and future forecast API
// current weather -- https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// future weather -- api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

// plug the data into the proper parts of the UI
// the div tag on line 42 (future-forecast) will be dynamically displayed purely using javascript
function getFuture() {}

// This is a for loop that was created to display each of the next five days forecast. The idea is to draw from the HTML to repeat the single column of the table five times.
// for (var i = 0; i < futureForecast.length; i++) {
//   var outerDiv = document.createElement('div');
//   outerDiv.id = futureForecast[i];
//   outerDiv.classList.add('column', 'future-forecast');
//   outerDiv.innerHTML = `<div class="future-forecast"></div>`
//   futureForecast.append(outerDiv);
// }

// add the searched city to the search history using localstorage
function populateSearchHistory() {
  if (localStorage.getItem("weatherSearchHistory")) {
    searchHistoryEle.innerHTML = "";
    const array = JSON.parse(localStorage.getItem("weatherSearchHistory"));

    array.forEach((searchItem) => {
      const button = document.createElement("button");
      button.textContent = capitalizeFirstLetter(searchItem);
      button.addEventListener("click", () => {
        executeSearch(searchItem);
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
searchButton.addEventListener("click", searchInput);
