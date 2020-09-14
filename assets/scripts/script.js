var destination;
var fullDestination;
var lat;
var lon;
var destinationCoord;
var imgSrcArray = [];
var firstResponse;
var states =
    ['alabama', 'alaska', 'american Samoa', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'district of columbia', 'federated states of micronesia', 'florida', 'georgia', 'guam', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'marshall islands', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'north carolina', 'north dakota', 'northern mariana islands', 'ohio', 'oklahoma', 'oregon', 'palau', 'pennsylvania', 'puerto rico', 'rhode Island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virgin island', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'];
var airportIcon = document.querySelector("#airport-icon")
var currentUVIndex = document.querySelector("#uv");
var weatherIcon = document.querySelector("#weather-icon");
var currentTemp = document.querySelector("#temp");
var currentHumidity = document.querySelector("#humidity");
var currentWindSpeed = document.querySelector("#windspeed");
var weatherAPIKEY = '7b0197c226ae249e6f7f72a52e0e15b5';
var aerisAPIKEY = 'CMvFQF9jag1d3EMFHicMv';
var aerisSecretKey = 'BQdV0ALmk1uCwHhrboePox3rLJ6dwF9TjP8pzV9n';
$(".btn").on("click", function () {
    event.preventDefault();
    destination = $(".form-control").val();
    console.log(destination);
    destination = destination.trim();
    destination = destination.toLowerCase();
    if (destination === "newyork" || destination === "new york") {
        destination = "NEWYORK CITY";
    }
    if (states.includes(destination)) {
        destination = destination.toUpperCase();
        $("#my-modal-body").html(`${destination} is Not a Valid City!`);
        $('#myModal').modal('show');
    }
    else {
        getGeocode();
    }
});// get input, store in var destination, and call getGeocode
function changeDestinationName(destination) {
    $("#city").html(`${destination} LOCAL GUIDE`);
}// update destination name
function getGeocode() {
    if (!destination) {
        $("#my-modal-body").html(`Enter a US City`);
        $('#myModal').modal('show');
        return;
    }
    else {
        fetch(`https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/geoname?name=${destination}&apikey=5ae2e3f221c38a28845f05b60fec7edd6c3842c3f334aa9d51ab3bfd`)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                if (response.status === "NOT_FOUND") {
                    $("#my-modal-body").html(`City is Not Valid`);
                    $('#myModal').modal('show');
                    return;
                }
                else {
                    //const places = getPlaces(response);
                    destination = response.name;
                    storeDestination();
                    getPlacesXID(response);
                    lat = response.lat;
                    lon = response.lon;
                    destinationCoord = `${response.lat},${response.lon}`;
                }
            })
    }
}// fetch destination Geocode, update Lat and call 
function getPlacesXID(response) {
    fetch(`https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/radius?radius=16093.4&lon=${response.lon}&lat=${response.lat}&rate=3&kinds=other%2Cnatural%2Csport%2Cindustrial_facilities%2Chistorical_places%2Carchaeology%2Ccultural%2Carchitecture%2Camusements&limit=6&apikey=5ae2e3f221c38a28845f05b60fec7edd6c3842c3f334aa9d51ab3bfd`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            getPlaceInfo(response.features);
        })
}// fetch POIs within a 5 miles radius
function getPlaceInfo(xIDs) {
    const promises = xIDs.map((xIDs) => {
        return fetch(`https://api.opentripmap.com/0.1/en/places/xid/${xIDs.properties.xid}?apikey=5ae2e3f221c38a28845f05b60fec7edd6c3842c3f334aa9d51ab3bfd`)
    })
    Promise.all(promises)
        .then(values => {
            return Promise.all(values.map(function (value) {
                return value.json();
            }))
        })
        .then(function (response) {
            displayCarousel(response);
        });  
    }// fetch images and place description
    function displayCarousel(response) {
        $(".carousel-inner").empty();
        response.map(function (response, index) {
            var imgSrc = response.preview.source;
            var pxIndex = imgSrc.lastIndexOf("px");
            var newImgSrc = imgSrc.replace(`${imgSrc[pxIndex - 3]}${imgSrc[pxIndex - 2]}${imgSrc[pxIndex - 1]}`, "999");
            var carouselItem = $(`<div class="carousel-item text-center"><img src=${newImgSrc}  class="mx-auto d-block" alt=...><div class="carousel-caption d-none d-md-block"><h2>${response.name}</h2><p>${response.wikipedia_extracts.text}</p></div></div>`)
            $(".carousel-inner").append(carouselItem);
            if (index === 0) {
                $(".carousel-item").addClass("active");
            }
        });
        fetchAirports();
        weatherFetch();
}// display carousel
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
}// fetch weather information
function displayWeather(response) {
    var iconSrc = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    weatherIcon.setAttribute("src", iconSrc);
    airportIcon.setAttribute("src", "./assets/images/airport-clipart.jpg");
    currentTemp.innerHTML = `Temperature: ${response.main.temp} &#8457`;
    currentHumidity.innerHTML = `Humidity: ${response.main.humidity}%`;
    currentWindSpeed.innerHTML = `Windspeed: ${response.wind.speed} MPH`
}// display weather information
function addUVIndex(response) {
    currentUVIndex.innerHTML = `UV Index: ${response.value}`;
}// display UV index
function fetchAirports() {
    fetch(`https://api.aerisapi.com/places/airports/closest/?client_id=${aerisAPIKEY}&client_secret=${aerisSecretKey}&p=${lat},${lon}&limit=1&radius=500miles&filter=largeairport&`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            $("#airport-code").html((response.response[0].profile.iata).toUpperCase());
            $("#airport").html(response.response[0].place.name);
            fullDestination = `${response.response[0].place.city}, ${response.response[0].place.state}`;
            changeDestinationName(fullDestination);
    })
}// fetch closest airport

function storeDestination() {
    if (typeof (Storage) !== "undefined") {
        //Store
        localStorage.setItem("destination", destination);
       
    }
    else {//notify user
        window.alert("Sorry, your browser does not support Web Storage...");
    }

}//store destination value in local storage

function onLoad() {
    if (localStorage.getItem("destination") !== null) {
        destination = localStorage.getItem("destination")
    }
    else {
        destination = "Cleveland";
    }
    getGeocode(destination);
}// functions to call onLoad
onLoad();