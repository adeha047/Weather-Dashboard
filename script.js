
$(document).ready(function () {
  var places = [];
  var placeList = $("#place-list");
  var today = new Date();
  //console.log(today)
  var day = today.getDate()
  console.log(today)
  var month = today.getMonth() + 1
  console.log(month, day)
  var dayMonth = month + "/" + day

  //console.log(dayMonth)

  renderPlaces()

  init()

  function init() {
    // Get stored todos from localStorage
    // Parsing the JSON string to an object
    var requestedPlaces = JSON.parse(localStorage.getItem("places"));

    // If places were retrieved from localStorage, update the places array to it
    if (requestedPlaces !== null) {
      places = requestedPlaces;
    }

    // Render places to the DOM
    renderPlaces();
  }


  // Stringify and set "places" key in localStorage to åarray
  localStorage.setItem("places", JSON.stringify(places));


  function renderPlaces() {
    placeList.empty();

    for (var i = 0; i < places.length; i++) {
      var place = places[i];

      var li = $("<li>").text(place)
      li.attr("id", "listC");
      li.attr("data-place", place);
      li.attr("class", "list-group-item");
      //console.log(li)
      placeList.prepend(li);

    }

  }

  $("#searchCity").on("click", function (event) {

    event.preventDefault();
    var searchedCity = $("#city-input").val()

    if (searchedCity === "") {
      return;
    }
    places.push(searchedCity);

    renderPlaces();





    var apiKey = "e8d14887d5b6d039259af91ed0883179";
    var weather = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apiKey}`;




    $("#daily-weather").empty();
    $.ajax({
      url: weather,
      method: "GET"
    }).then(function (response) {
      console.log(response)
      $("#daily-weather").append(dayMonth)
      var placeTitle;
      placeTitle = $("<h3>").text(response.name + " ")
      $("#daily-weather").append(placeTitle)
      var iconCode;
      iconCode = response.weather[0].icon;
      $("#daily-weather").append(iconCode)
      var farhren = (response.main.temp - 273.15) * 1.80 + 32;
      farhren = $("<h3>").text("Temperature: " + farhren.toFixed() + "F");
      $("#daily-weather").append(farhren);
      var humid = (response.main.humidity);
      humid = $("<h3>").text("Humidity: " + humid + "%")
      $("#daily-weather").append(humid);
      var windy = (response.wind.speed);
      windy = $("<h3>").text("Wind Speed: " + windy + "mph");
      $("#daily-weather").append(windy);

      var coordinateLon = response.coord.lon;
      var coordinateLat = response.coord.lat;

      weather2 = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${coordinateLat}&lon=${coordinateLon}`;


      $.ajax({
        url: weather2,
        method: "GET"
      }).then(function (responseUV) {

        
        var placeUV = (responseUV.value)
        placeUV1 = $("<h3>").text("UV Index: " + placeUV);
        $("#daily-weather").append(placeUV1)
        if (responseUV.value > 0 && responseUV.value <= 2) {
          placeUV1.attr("style", "color:green")
        }
       
        
        else if (placeUV > 2 && placeUV <= 5){
            placeUV.attr("style","color:yellow")
        }
        else if (placeUV >5 && placeUV <= 7){
            placeUV.attr("style","color:orange")
        }
        else if (placeUV >7 && placeUV <= 10){
            placeUV.attr("style","color:red")
        }
        else{
            placeUV.attr("style","color:purple")
    
          //console.log(typeof responseUV)
        }

      })

      weather5 = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${apiKey}`;

      $.ajax({
        url: weather5,
        method: "GET"
      }).then(function (response5) {
        //$("#boxes").append(dayMonth)
        //console.log(response5)
        for (i = 0; i < 5; i++) { // start for loop
          // creates the columns
          var forecast = $("<div>").attr("class", "col-5 m-2 bg-primary forecast-div");
          $("#boxes").append(forecast);
          var weatherList = response5.list[i * 8].dt;
          console.log(weatherList)
          var time = new Date(0)
          time.setUTCSeconds(weatherList);
          var date = time;
          var month = date.getMonth() + 1
          var day = date.getDate()
          var dayMonth = month + "/" + day
          var forecast5 = $("<h3>").text(dayMonth)
          forecast.append(forecast5);
          var iconCode;
          iconCode = response5.list[i * 8].weather[0].icon;
          var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
          forecast.append($("<img>").attr("src", iconURL));
          var farhren2 = (response5.list[i * 8].main.temp - 273.15) * 1.80 + 32;
          farhren2 = $("<p>").html("Temp: " + farhren2.toFixed() + "F");
          forecast.append(farhren2);
          var humid2 = (response5.list[i * 8].main.humidity)
          humid2 = $("<p>").html("Humidity: " + humid2 + "%")
          forecast.append(humid2);






        }


      }









      )




    });



  });

});


