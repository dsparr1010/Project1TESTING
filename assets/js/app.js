$(document).ready(function () {
    var searchInput = $('#searchInp');
    var searchButton = $('#searchBtn');
    var trailLength='';
    var stars='1';
    var APIKEY = '200624582-ef03dfcbf90f2bd9243bdef3d1acb99b';

    $(".results").hide();
    $("#filterSearchBtn").on('click', function(){
        // ratingFilter()
        trailLength =  document.getElementById("lengthSlider");
        console.log(trailLength.value);
        if ($('#rating5').is(':checked')) {
            stars = '5';
             console.log(stars)
         }
         else if ($('#rating4').is(':checked')) {
          stars = '4';
             console.log(stars)
         }
         else if ($('#rating3').is(':checked')) {
          stars = '3';
          console.log(stars)

         }
         else if ($('#rating2').is(':checked')) {
          stars = '2';
          console.log(stars)

         }
         else if ($('#rating1').is(':checked')) {
          stars = '1';
          console.log(stars)
         }
        searchResults(trailLength.value,stars);
    });
  
       function searchResults(trailLength,stars){
        $('.searchResults').empty()     
        address = searchInput.val();
        $(".searchBox").hide();
        $(".results").show();
        var geoCodeApi = {
            "async": true,
            "crossDomain": true,
            "url": `https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?location=${address}`,
            "method": "GET",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
                "x-rapidapi-key": "4fbf5f804emshb740f6dffabc9b7p106402jsnf97c633c941b"
            }
        }
        $.ajax(geoCodeApi).done(function (response) {
            var LATITUDE = response.Results[0].lat;
            var LONGITUDE = response.Results[0].lon;
            var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${LATITUDE}&lon=${LONGITUDE}&key=${APIKEY}&minStars=${stars}&minLength=${trailLength}`;
            console.log(queryURL);
            var settings = {
                "url": queryURL,
                "method": "GET",
            }

            //setting map view point
            var mymap = L.map('mapid').setView([LATITUDE, LONGITUDE], 12)

            $.ajax(settings).done(function (result) {
                console.log(result);
                var trails = result.trails;
                for (var i = 0; i < trails.length; i++) { 
                    var card =$("<div class='card horizontal myCard'>");
                    var cardimage=$('<div class="card-image">'); 
                    var cardStacked=$('<div class="card-stacked">');
                    var cardContent=$('<div class="card-content">');
                    var cardAction=$('<div class="card-action center">');
                                       
                    card.append(cardimage);
                    card.append(cardStacked);
                    cardStacked.append(cardContent);
                    cardStacked.append(cardAction);
                    cardAction.append($("<a>").text("SHOW IN MAP")
                    .addClass('cardLinks'));

                    var image = $("<img>");
                    image.attr("src", trails[i].imgSmall);
                    cardimage.append(image);

                    var lat = trails[i].latitude;
                    console.log(lat)
                    // $('.cardLinks').click(function(event, i) {
                    //     console.log(event.target)
                        what(event, i)
                    // })
                    //trying to grab lat and lon on click


                    var name = $("<p class='name'>").text(trails[i].name);
                    var difficulty = $("<p>").text("Difficulty: " + trails[i].difficulty);
                    var location = $("<p>").text("Location: " + trails[i].location);
                    var length = $("<p>").text("Length: " + trails[i].length);
                    var rating = $("<p>").text("Rating: " + trails[i].stars);
                    cardContent.append(name);
                    cardContent.append(location);
                    cardContent.append(length);
                    cardContent.append(difficulty);
                    cardContent.append(rating);

                    $('.searchResults').append(card);
                }

                    //map
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiZGVicmFzcGFyciIsImEiOiJjazJiNmJ2cDUwMHg5M2NxY29yeGQ0cWowIn0._VZcZvPTCyIjGPjjz3FG7w'
                }).addTo(mymap);
                var circle = L.circle([LATITUDE, LONGITUDE], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 150
                }).addTo(mymap);

            });
        });
    }
    
    function what(event, i){
        console.log(i)                   
//         $('.cardLinks').click(function() {
            console.log('worked')
        }

    searchButton.click(function (e) {
        e.preventDefault();    
        searchResults();
    });
});