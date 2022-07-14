//OpenWeatherMap API Key
var key = '66108857e5269e30957c9122ce9d9d84';

//these variables will help us make our search history
var city, state;
var listCityNames = JSON.parse(localStorage.getItem('City')) || [];
//Call a function that populates search history under search bar

//The start up page function that populates the search history if there is information in local storage
function start() {
    for (var i = 0; i < listCityNames.length; i++) {
        var $liEl = $('<li>').text(`${listCityNames[i].city}, ${listCityNames[i].state}`);
        $('#search-history').append($liEl);
        $('#search-history li').addClass("search-history-btn");
    }

    //After the user enters their city and selects their state, they press "Search" and start next function
    $('#search-button').on("click", fetchLocation);
    $('#search-history li').on("click", previousLocation);
}

//This finds the coordinates for the city selected from search history
function previousLocation() {
    var storedCityEl = this;
    var storedCity = storedCityEl.innerText;
    city = storedCity.slice(0, -4);
    state = storedCity.slice(-2);
var url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=${key}`;

    fetch(url)
        .then((resp) => {
            if (!resp.ok) throw new Error(resp.statusText);
            return resp.json();
        })
        .then((data) => {
            fetchPreviousWeather(data);      
;        })
        .catch(console.err);
}

//This finds the weather from the search history
function fetchPreviousWeather(data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
    city = data[0].name;

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
}

//This function takes the coordinates and collects the weather data
function fetchWeather(data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
    city = data[0].name;
    var storeCity = { city, state };

        listCityNames.push(storeCity);
        var cityNames = JSON.stringify(listCityNames);
        localStorage.setItem("City", cityNames);

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

//This function populates the current weather
function currentWeather(data) {
    var today = moment().format("MM/DD/YY");
    var icon = data.current.weather[0].icon;
    var iconAlt = data.current.weather[0].description;
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvIndex = data.current.uvi;

    var $divEl = $('<div>').html(
        `<section id="current-weather">
            <h2>${city}, ${state} (${today})</h2>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${iconAlt}">
            <li>Temp: ${temp}℉</li>
            <li>Wind: ${wind} mph</li>
            <li>Humidty: ${humidity}%</li>
            <li>UV Index: <span id="uv-color">${uvIndex}</span></li>
        </section>`
    ) 
    
    $('#weather-container').prepend($divEl);
    
    $('#weather-container').removeClass("hidden");
    

    if (uvIndex <= 2) {
        $('#uv-color').css("background-color", "green");
    } else if (uvIndex > 2 && uvIndex <= 8) {
        $('#uv-color').css("background-color", "#FFCF36");
    } else if (uvIndex > 8) {
        $('#uv-color').css("background-color", "red");
    }
}

//This function give the dates for the next 5 days as well as the weather info
function fiveDayForecast(data) {
    for (var i = 0; i < 5; i++) {
        var date = moment().add(1 + i, 'days').format("MM/DD/YY");
        var icon = data.daily[i].weather[0].icon;
        var iconAlt = data.daily[i].weather[0].description;
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;
        
        var $divEl = $('<div>').html(`
        <div class="daily-weather-card" id="day-${i}">
            <h4>${date}</h4>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${iconAlt}">
            <li>Temp: ${temp}℉</li>
            <li>Wind: ${wind} mph</li>
            <li>Humidty: ${humidity}%</li>
        </div>`);

        $('#days-container').append($divEl);
    }
}

start();

