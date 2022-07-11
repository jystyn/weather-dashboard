//OpenWeatherMap API Key
var key = '66108857e5269e30957c9122ce9d9d84';

//these variables will help us make our search history
var city;
var state;
var listCityNames = JSON.parse(localStorage.getItem('city')) || [];
//Call a function that populates search history under search bar

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
}

//This function takes the coordinates and collects the weather data
function fetchWeather(data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
    city = data[0].name;
    var storeCity = { city, state };
    listCityNames.push(storeCity);
    localStorage.setItem("City", JSON.stringify(listCityNames));

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
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvIndex = data.current.uvi;

    $('#current-city-name').text(`${city}, ${state} (${today})`);
    $('#current-icon').attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
    $('#current-temp').text(`Temp: ${temp}℉`);
    $('#current-wind').text(`Wind: ${wind} mph`);
    $('#current-humidity').text(`Humidity: ${humidity}%`);
    $('#uv-index').html(`<li>UV Index: <span id="uv-color">${uvIndex}</span></li>`);

    if (uvIndex <= 2) {
        $('#uv-color').css("background-color", "green");
    } else if (uvIndex > 2 && uvIndex <= 8) {
        $('#uv-color').css("background-color", "#FFCF36");
    } else if (uvIndex > 8) {
        $('#uv-color').css("background-color", "red");
    }
}

function fiveDayForecast(data) {
    $('#day-1-date').text(moment().add(1, 'days').format("MM/DD/YY"));
    $('#day-2-date').text(moment().add(2, 'days').format("MM/DD/YY"));
    $('#day-3-date').text(moment().add(3, 'days').format("MM/DD/YY"));
    $('#day-4-date').text(moment().add(4, 'days').format("MM/DD/YY"));
    $('#day-5-date').text(moment().add(5, 'days').format("MM/DD/YY"));

    //This .each method allows us to repeat processes instead of repeating the same code
    $(`.daily-weather-card`).each(function (i) {
        var icon = data.daily[i].weather[0].icon;
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;
        $(`#day-${i}-icon`).attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
        $(`#day-${i}-temp`).text(`Temp: ${temp}℉`);
        $(`#day-${i}-wind`).text(`Wind: ${wind} mph`);
        $(`#day-${i}-humidity`).text(`Humidity: ${humidity}%`);
    })
}

