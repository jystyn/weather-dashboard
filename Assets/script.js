fetch('https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=66108857e5269e30957c9122ce9d9d84')
.then(res => res.json())
.then(data => console.log(data));

// function getLocation() {
//     return new Promise(resolve => {
//         navigator.geolocation.getCurrentPosition(({ coords }) => {
//             resolve({ lat: coords.latitude, lon: coords.longitude });
//         });
//     });
// }

// getLocation()
//     .then(data => {
//         // Use the user's location information for weather/etc.
//         console.log(data);
//     }); 