
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
    
    
    // Parsing the JSON string to an object
    var requestedPlaces = JSON.parse(localStorage.getItem("places"));

    console.log(requestedPlaces)

    // If places were retrieved from localStorage, update the places array to it
    if (requestedPlaces) {
      places = requestedPlaces
      renderPlaces();

    
    }
    //renderPlaces();
  }


  // Stringify and set "places" key in localStorage to array
  //localStorage.setItem(places, JSON.stringify(places.value));


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

    function renderWeatherDashboard(searchedCity) {
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
      //adds the title of the city
      $("#daily-weather").append(placeTitle)
      var iconCode;
      iconCode = response.weather[0].icon;
      //adds icon to the daily weather section
      var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
      $("#daily-weather").append($("<img>").attr("src", iconURL));
      var farhren = (response.main.temp - 273.15) * 1.80 + 32;
      //added farhen and the equation to grab the temp from the API
      farhren = $("<h3>").text("Temperature: " + farhren.toFixed() + "F");
      $("#daily-weather").append(farhren);
      //added humidity to page
      var humid = (response.main.humidity);
      humid = $("<h3>").text("Humidity: " + humid + "%")
      $("#daily-weather").append(humid);
      //added wind to page
      var windy = (response.wind.speed);
      windy = $("<h3>").text("Wind Speed: " + windy + "mph");
      $("#daily-weather").append(windy);

      
      //called variables used in second API call
      var coordinateLon = response.coord.lon;
      var coordinateLat = response.coord.lat;

      weather2 = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${coordinateLat}&lon=${coordinateLon}`;


      $.ajax({
        url: weather2,
        method: "GET"
      }).then(function (responseUV) {

        
        var placeUV = (responseUV.value)
        //new variables for UV Index
        placeUV1 = $("<h3>").text("UV Index: " + placeUV);
        $("#daily-weather").append(placeUV1)
        //if statement to add style from CSS to the UV index depending on the number
        if (placeUV> 0 && placeUV<= 2) {
          placeUV1.attr("style", "color:green")
        }
       
        
        else if (placeUV > 2 && placeUV <= 5){
            placeUV1.attr("style","color:yellow")
        }
        else if (placeUV >5 && placeUV <= 7){
            placeUV1.attr("style","color:orange")
        }
        else if (placeUV >7 && placeUV <= 10){
            placeUV1.attr("style","color:red")
        }
        else{
            placeUV1.attr("style","color:purple")
    
          //console.log(typeof responseUV)
        }

      })

      weather5 = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${apiKey}`;

      $("#boxes").empty()

      $.ajax({
        url: weather5,
        method: "GET"
      }).then(function (response5) {
        //console.log(response5)
        for (i = 0; i < 5; i++) { // start for loop
          // creates the columns
          var forecast = $("<div>").attr("class", "col-2 m-2 bg-primary forecast-div");
          //div to add the 5 days for the forecast
          $("#boxes").append(forecast);
          var weatherList = response5.list[i * 8].dt;
          //added weatherlist variable to the ajax call, but needed to multiply the i * 8 because the API lists the weather every 3 hours. 
          //console.log(weatherList)
          var time = new Date(0)
          //added time to the 5 day forecast
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
          //added new icons for each day of the 5 day forecast
          var farhren2 = (response5.list[i * 8].main.temp - 273.15) * 1.80 + 32;
          farhren2 = $("<h3>").html("Temp: " + farhren2.toFixed() + "F");
          forecast.append(farhren2);
          var humid2 = (response5.list[i * 8].main.humidity)
          humid2 = $("<h3>").html("Humidity: " + humid2 + "%")
          forecast.append(humid2);

          //added temperature and humidity for the 5 day forecast. 






        }


      }









      )




    });

  }




  

  
  $(document).on('click','.list-group-item',function(event){
    event.preventDefault();
    var selectedPlace = $(this).data("place")
    console.log(selectedPlace)

     renderWeatherDashboard(selectedPlace) 
  })

  $("#searchCity").on("click", function (event) {

    event.preventDefault();
    var searchedCity = $("#city-input").val()

    if (searchedCity === "") {
      return;
    }
    places.push(searchedCity);
    localStorage.setItem("places", JSON.stringify(places));

    renderPlaces();
    renderWeatherDashboard(searchedCity) 

  });




    

});


