var destination;
var image;
//var i;
var imgSrcArray = [];
var firstResponse;
var data;

//var xID=[];
// get input and store in var city
$(".btn").on("click", function () {
    event.preventDefault();
    destination = $(".form-control").val();
    console.log(destination);
    destination = destination.trim();
    changeCityName(destination);
    getGeocode(destination);

});

function changeCityName(destination) {
    $("#city").val = destination; 
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
                    //console.log(response.json());
                    //const places = getPlaces(response);
                    getPlacesXID(response);
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
        });

   
}
function searchQuery() {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&units=imperial&appid=${APIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            currentDayWeather(response);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`)
                .then(function (response) {
                    return response.json();
                }).then(function (response) {
                    addUVIndex(response);
                })
        });
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&units=imperial&appid=${APIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            displayForcast(response);
        });
}

function onLoad() {
    changeCityName("Cleveland");
    getGeocode("Cleveland");
}

onLoad();