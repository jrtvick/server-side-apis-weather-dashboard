// establish global variables
// var iconURL = 'https://openweathermap.org/img/wn/';
// var icon = document.createElement('img');
// icon.setAttribute('src', iconURL + data.weather[0].icon + '.png');
// var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + "&appid=" + APIKey + '&units=metric';


var inputField = document.getElementById("input-field");
var searchButton = document.getElementById("search-button");

var oldSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
var futureForecast = document.getElementById("future-forecast");

// get the value of the search input.
function searchInput() {
    var userSearch = inputField.value;
    if (userSearch === "") {
        alert("Invalid. Please write something in the search field.");
    }
    // take the value of the search input and put it into a variable in the local storage.
    var searchArray = {
        userSearch,
        inputField,
    };
    oldSearch.push(searchArray);
    localStorage.setItem("prevSearch", JSON.stringify(oldSearch));
}


// use the search value to query the geocode API


// the geocache api link -- http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// use the latitude and longitude data from the geocode API to query the current weather API and future forecast API
// current weather -- https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// future weather -- api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

// plug the data into the proper parts of the UI
// the div tag on line 42 (future-forecast) will be dynamically displayed purely using javascript
// This is a for loop that was created to display each hour of the schedule. The idea is to draw from the HTML to repeat the single row of the table nine times. 
for (var i = 0; i < futureForecast.length; i++) {
    var outerDiv = document.createElement('div');
    outerDiv.id = futureForecast[i];
    outerDiv.classList.add('column', 'future-forecast');
    outerDiv.innerHTML = `<div class="future-forecast"></div>`
    futureForecast.append(outerDiv);
    
    `<div class="col-2 col-md-1 hour text-center py-3">${getHour(hours[i])}
    </div><textarea class="col-8 col-md-10 description" rows="3">${localStorage.getItem(hours[i]) || ''}</textarea><button id="${hours[i]}" class="btn saveBtn col-2 col-md-1"aria-label="save"><i class="fas fa-save" aria-hidden="true"></i></button>`;
    rowContainer.append(outerDiv);
}


// add the searched city to the search history using localstorage
// create one key that will represent the cities that have been searched and its value will be an array of strings -- those strings themselves will be literally the cities searched
localStorage.setItem("searchHistory", JSON.stringify([]));
var searchHistory = localStorage.getItem("searchHistory");
console.log(searchHistory);

// all of my listeners
searchButton.addEventListener('click', searchInput);