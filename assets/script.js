$(document).ready(function () {
    // current date
  var currentDate = moment().format("LL");
  // openweathermap API key
  var apiKey = "f61c25ccc3ebc66abfbc574449b8e000";
  // currentsapi API key
  var newsKey = "9IXe5c_s3--5QTnekNRF_UT5u7i-26QOsoSuyOkdk-o5hlmS";
  var searchedCity;
  // search button event listener
  $("#btn-citySearch").click(function () {
    searchedCity = $("#citySearch-inp").val().trim();
    getWeatherByCity();
    getNewsBycity();
    event.preventDefault();
  });
  // call currentsapi API
  function getNewsBycity() {
    let newsUrl = `https://api.currentsapi.services/v1/search?keywords=${searchedCity}&language=en&apiKey=${newsKey}`;
    fetch(newsUrl)
      .then(function (response) {
        return response.json();
        // console.log (response.json());
      })
      .then(function (response) {
        // empty carousel and count it to 5 news
		$(".carousel-inner").empty();
		var counter = 0;
        $(response.news).each(function (index, newsData) {
			if(newsData.image && newsData.image =="None") {
			} else {
				let carouselinner = `<div class='carousel-item ${counter == 0 ? ' active' : ""}'>`;
				carouselinner += `<img src="${newsData.image}" class="d-block w-100" alt="...">`;
				carouselinner += `<div class="carousel-caption d-none d-md-block">`;
				carouselinner += `<h2>${newsData.title}</h2>`;
				carouselinner += `</div></div>`;
				$('#carousel-inner').append(carouselinner);
				counter++;
				
			}
			console.log (newsData);
		if(counter >= 4) {
			return false;
		}
        });
      });
  }

  // weather info
  function getWeatherByCity() {
    let todayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apiKey}`;
    fetch(todayUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let cityName = response.name + ` : ` + response.sys.country;
        let tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed();
        let humidity = response.main.humidity;
        let windSpeed = response.wind.speed;
        let icon = response.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

        $("#current-date").text(currentDate + " ");
        $("#currentCity").text(cityName + ",  ");
        $("#img").attr("src", iconUrl);
        $("#temperature").text("temperature:  " + tempF + "  °F");
        $("#humidity").text("humidity:  " + humidity + "  %");
        $("#windspeed").text("windspeed:  " + windSpeed + "  MPH");
        let uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
        fetch(uvUrl)
          .then(function (response1) {
            return response1.json();
          })
          .then(function (response1) {
            let uvVal = response1.value;
            $("#uv").text("UV index:  " + uvVal);
            let i = uvVal;

            if (i < 3) {
              $("#uv").addClass("green");
            } else if (i < 6) {
              $("#uv").addClass("yellow");
            } else if (i < 8) {
              $("#uv").addClass("orange");
            } else if (i < 11) {
              $("#uv").addClass("red");
            } else {
              $("#uv").addClass("purple");
            }
          });
      });
  }
});
