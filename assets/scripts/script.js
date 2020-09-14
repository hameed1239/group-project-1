var destination = "CLEVELAND";
var fullDestination = "CLEVELAND, OH"
var lat = "41.4995";
var lon = "-81.69541"
var destinationCoord = `41.4995,-81.69541`
var image;
//var i;
var imgSrcArray = [];
var firstResponse;
var data;
var currentUVIndex = document.querySelector("#uv");
var currentIcon = document.querySelector("#weather-icon");
var currentTemp = document.querySelector("#temp");
var currentHumidity = document.querySelector("#humidity");
var currentWindSpeed = document.querySelector("#windspeed");
var weatherAPIKEY = '7b0197c226ae249e6f7f72a52e0e15b5';
var aerisAPIKEY = 'CMvFQF9jag1d3EMFHicMv';
var aerisSecretKey = 'BQdV0ALmk1uCwHhrboePox3rLJ6dwF9TjP8pzV9n';

//var xID=[];
// get input and store in var city
$(".btn").on("click", function () {
    event.preventDefault();
    destination = $(".form-control").val();
    console.log(destination);
    destination = destination.trim();
    destination = destination.toUpperCase();
    if (destination === "NEWYORK" || destination === "NEW YORK") {
        destination = "NEWYORK CITY";
    }
    getGeocode(destination);
});

function changeCityName(destination) {
    $("#city").html(`${destination} LOCAL GUIDE`);
}
//fetch geocode and poi
function getGeocode(destination) {
    if (!destination) {
        console.log(`no destination entered`);
        return;
    }
    else {
        fetch(`https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/geoname?name=${destination}&country=US&apikey=5ae2e3f221c38a28845f05b60fec7edd6c3842c3f334aa9d51ab3bfd`)
            .then(function (response) {
                //console.log(response.json());
                return response.json();
            })
            .then(function (response) {
                if (response.status === "NOT_FOUND") {
                    //console.log(response.json());
                    console.log("Not Found");
                }
                else {
                    console.log(response);
                    //const places = getPlaces(response);
                    destination = response.name;
                    getPlacesXID(response);
                    lat = response.lat;
                    lon = response.lon;
                    destinationCoord = `${response.lat},${response.lon}`
                    
                }
            })
    }


}

function getPlacesXID(response) {
    //     debugger;
    //const response = getGeocode(destination);
    // if (response === "Not Found") {
    //     //handle with modal or error <p>
    //     console.log("Not Found");
    //     return ("Not Found");
    // }
    // else {
    console.log(response);
    fetch(`https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/radius?radius=16093.4&lon=${response.lon}&lat=${response.lat}&rate=3&kinds=other%2Cnatural%2Csport%2Cindustrial_facilities%2Chistorical_places%2Carchaeology%2Ccultural%2Carchitecture%2Camusements&limit=6&apikey=5ae2e3f221c38a28845f05b60fec7edd6c3842c3f334aa9d51ab3bfd`)
        .then(function (response) {
            console.log("reached 2nd call to json()")
            return response.json();
        })
        .then(function (response) {
            console.log("reached conversion")
            console.log(response);
            getPlaceInfo(response.features);
        })

    // }
}


// }
function getPlaceInfo(xIDs) {
    //const response = getGeocode(destination);
    // const data = response;
    // console.log(data);

    const promises = xIDs.map((xIDs) => {
        return fetch(`https://api.opentripmap.com/0.1/en/places/xid/${xIDs.properties.xid}?apikey=5ae2e3f221c38a28845f05b60fec7edd6c3842c3f334aa9d51ab3bfd`)
    })

   // console.log(promises.json())

    Promise.all(promises)
        .then(values => {
            return Promise.all(values.map(function (value) {
                return value.json();
            }))
        })
        .then(function (response) {
            console.log(response);
            $(".carousel-inner").empty();
            response.map(function (response, index) {
                var imgSrc = response.preview.source;
                var pxIndex = imgSrc.lastIndexOf("px");
                var newImgSrc = imgSrc.replace(`${imgSrc[pxIndex - 3]}${imgSrc[pxIndex - 2]}${imgSrc[pxIndex - 1]}`, "300");
                //console.log(newImgSrc);
                // imgSrcArray.push(newImgSrc);
               var carouselItem = $(`<div class="carousel-item text-center"><img src=${newImgSrc}  class="mx-auto d-block" alt=...><div class="carousel-caption d-none d-md-block"><h2>${response.name}</h2><p>${response.wikipedia_extracts.text}</p></div></div>`)
                
                $(".carousel-inner").append(carouselItem);
                console.log(index);
                console.log(carouselItem);
                if (index === 0) {

                    $(".carousel-item").addClass("active");
                }

            });
            fetchAirports();
            weatherFetch();
        });

   
}
function weatherFetch() {

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            displayWeather(response);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${weatherAPIKEY}&lat=${lat}&lon=${lon}`)
                .then(function (response) {
                    return response.json();
                }).then(function (response) {
                    addUVIndex(response);
                })
        });
    // fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&units=imperial&appid=${APIKEY}`)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (response) {
    //         displayForcast(response);
    //     });
}
function displayWeather(response) {
    // var formatedDate = currentDate.format("M/D/YYYY");
    // currentDay.innerHTML = `${cityValue} ${formatedDate}`;
    var iconSrc = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    currentIcon.setAttribute("src", iconSrc);
    currentTemp.innerHTML = `Temperature: ${response.main.temp} &#8457`;
    currentHumidity.innerHTML = `Humidity: ${response.main.humidity}%`;
    currentWindSpeed.innerHTML = `Windspeed: ${response.wind.speed} MPH`

}
function addUVIndex(response) {
    currentUVIndex.innerHTML = `UV Index: ${response.value}`;
}

function fetchAirports() {
    fetch(`https://api.aerisapi.com/places/airports/closest/?client_id=${aerisAPIKEY}&client_secret=${aerisSecretKey}&p=${lat},${lon}&limit=1&radius=25miles&filter=largeairport&`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            $("#airport-code").html((response.response[0].profile.iata).toUpperCase());
            $("#airport").html(response.response[0].place.name);
            fullDestination = `${response.response[0].place.city}, ${response.response[0].place.state}`;
            changeCityName(fullDestination);
    })
}

function onLoad() {
    getGeocode(destination);
}
onLoad();