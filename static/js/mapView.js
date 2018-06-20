var queryUrl = "/data/country/";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data);  
});

function getSize(d) {
    return d == "High income" ? 5 :
           d == "Upper middle income"  ? 4 :
           d == "Lower middle income"  ? 3 :
           d == "Low income"  ? 2 :
                      1;
    }

function createFeatures(kivaData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake

    var incomeLevel = d3.json(kivaData, {
        pointToLayer: function (feature, latlng) {
            return L.circle(latlng, {
                    radius: getSize(feature.income_level) * 10000,
                    fillColor: getColor(feature.income_level),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup("<h3>Place: " + feature.country_name +
                "</h3><hr><p>Income Level: " + feature.income_level + "</p>");
        }
    
});
  createMap(incomeLevel);
//});
  
}

// function getColor(d) {
//     return d > 5 ? 'OrangeRed' :
//            d > 4  ? 'orange' :
//            d > 3  ? 'coral' :
//            d > 2  ? 'gold' :
//            d > 1   ? 'GreenYellow' :
//                       'LawnGreen';
// }

function getColor(d) {
    return d == "High income" ? 'OrangeRed' :
           d == "Upper middle income"  ? 'orange' :
           d == "Lower middle income"  ? 'coral' :
           d == "Low income"  ? 'gold' :
                      'LawnGreen';
}


function createMap(incomeLevel/*, tectonicplates*/) {

//console.log("tectonic plates: "+ tectonicplates);
  // Define streetmap, darkmap and satellite map layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA");

    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA");
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satelite Map": satelliteMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Income Levels": incomeLevel
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, darkmap, satelliteMap]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
// Add legend to the map:
 var legend = L.control({position: 'bottomright'});
 legend.onAdd = function (myMap) {

     var div = L.DomUtil.create('div', 'info legend'),
     //mag = [0,1,2,3,4,5],
     incLevel = ["High income", "Upper middle income", "Lower middle income", "Low income"],
     labels = [];

     // loop through our density intervals and generate a label with a colored square for each interval
     for (var i = 0; i < incLevel.length; i++) {
         div.innerHTML +=
             '<i style="background:' + getColor(incLevel[i] + 1) + '"></i> ' +
             incLevel[i] + (incLevel[i + 1] ? '&ndash;' + incLevel[i + 1] + '<br>' : '+');
     }

     return div;
 };

 legend.addTo(myMap);

 
}
