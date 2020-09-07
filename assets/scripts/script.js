//Closest airport API    
// fetch("https://api.aerisapi.com/places/airports/closest?p=cleveland,oh&limit=5&radius=200miles&filter=mediumairport&sort=type&client_id=CMvFQF9jag1d3EMFHicMv&client_secret=BQdV0ALmk1uCwHhrboePox3rLJ6dwF9TjP8pzV9n")
//      .then(function (response) {
//          return response.json();
//      })
//      .then(function (response) {
//          console.log(response);
//      });

//Local News API
// fetch("https://api.currentsapi.services/v1/search?keywords=new york&language=en&apiKey=9IXe5c_s3--5QTnekNRF_UT5u7i-26QOsoSuyOkdk-o5hlmS")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (response) {
//         console.log(response);
//     });

//Closest 
//  const url = 'https://api.aerisapi.com/places/closest?p=richmond heights,oh&filter=neighborhood&format=json&radius=20mi&limit=20&client_id=CMvFQF9jag1d3EMFHicMv&client_secret=BQdV0ALmk1uCwHhrboePox3rLJ6dwF9TjP8pzV9n';

//  fetch(url)
//      .then(function (response) {
//          return response.json();
//      })
//      .then(function (json) {
//          console.log(window.status);
//          if (!json.success) {
//              console.log('Oh no!')
//          } else {
//              console.log(json)
//          }
//      });

// fetch("https://api.nytimes.com/svc/semantic/v2/concept/name/nytd_geo/Kansas?fields=all&api-key=gWWdzw0dma2X95Xvppddr4o7Oi7xfzlH")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (response) {
//         console.log(response);
//     });

// fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyA0NxPG6MKonFnDcDU6bRCIw51LoGc83Ek")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (response) {
//         console.log(response);
//     });

// fetch("https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/bbox?lon_min=-81.694359&lon_max=-80.694359&lat_min=41.499321&lat_max=42.499321&kinds=interesting_places&format=json&limit=20&apikey=5ae2e3f221c38a28845f05b6d72a7c15f960cf592862aee9b86f4b37")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (json) {
       
//             console.log(json)
        
//     });
// fetch("https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/geoname?name=Ohio&apikey=5ae2e3f221c38a28845f05b6d72a7c15f960cf592862aee9b86f4b37")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (json) {

//         console.log(json)

//     });

// fetch("https://cors-anywhere.herokuapp.com/https://api.opentripmap.com/0.1/en/places/radius?radius=50000&lon=-81.69541&lat=41.4995&apikey=5ae2e3f221c38a28845f05b6d72a7c15f960cf592862aee9b86f4b37")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (response) {
//         console.log(response);
//     });

fetch("https://cors-anywhere.herokuapp.com/http://api.opentripmap.com/0.1/ru/places/xid/Q4643424?apikey=5ae2e3f221c38a28845f05b6d72a7c15f960cf592862aee9b86f4b37")
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
         console.log(json);
        // console.log(json.status);
        // var statusCode = json.status;
        //  if (statusCode !== 200) {
        //      console.log('Oh no!')
        //  } else {
        //      console.log(json)
        //  }
    });