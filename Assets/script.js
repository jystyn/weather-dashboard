//OpenWeatherMap API Key
var key = '66108857e5269e30957c9122ce9d9d84';

//these variables will help us make our search history
var city;
var state;

//After the user enters their city and selects their state, they press "Search" and start next function
$('#search-button').on("click", fetchLocation);

//This function finds the coordinates of of the selected city and passes them to the next function
function fetchLocation(event) {
    event.preventDefault();
    city = $('#search-city-name').val();
    state = $('#select-state').val();
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=${key}`;

    fetch(url)
        .then((resp) => {
            if (!resp.ok) throw new Error(resp.statusText);
            return resp.json();
        })
        .then((data) => {
            fetchWeather(data);
        })
        .catch(console.err);

    //Save search history to local storage

    //Call a function that populates search history under search bar
}

//This function takes the coordinates and collects the weather data
function fetchWeather(data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`;

    fetch(url)
        .then((resp) => {
            if (!resp.ok) throw new Error(resp.statusText);
            return resp.json();
        })
        .then((data) => {
            currentWeather(data);
            fiveDayForecast(data);
        })
        .catch(console.err);
}

function currentWeather(data) {
    console.log(data);
    console.log(state);
}

function fiveDayForecast(data) {
    console.log(data);
}

