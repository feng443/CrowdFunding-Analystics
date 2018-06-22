function getSize(d) {
    return d == "High income" ? 5 :
           d == "Upper middle income"  ? 4 :
           d == "Lower middle income"  ? 3 :
           d == "Low income"  ? 2 :
                      1;
}

// Function to determine marker size based on income level
function markerSize(incomeLevel) {

  var size = getSize(incomeLevel)
  return size / 40;
}

var queryUrl = "/data/scatter/2016/f";
//var queryUrl = "../data/loanSummary.json";

function getColor(d) {
    return d == "High income" ? 'OrangeRed' :
           d == "Upper middle income"  ? 'orange' :
           d == "Lower middle income"  ? 'coral' :
           d == "Low income"  ? 'gold' :
                      'LawnGreen';
}

d3.json(queryUrl, function(kivaData) {
// Define array to hold created country markers
var countryMarkers = [];

console.log(kivaData[0])
console.log(kivaData.length)
// Loop through locations and create city and state markers
for (var i = 0; i < kivaData.length; i++) {

  // Set the marker radius for the state by passing population into the markerSize function
  console.log("kivaData.longitude: ")
  //console.log(function(d) { return d.longitude;})
  console.log(kivaData[i].longitude)
  countryMarkers.push(
    L.circle(kivaData[i].longitude, kivaData[i].latitude, {
      //L.circle(function(d) { return d.longitude;}, function(d) { return d.latitude;},{
      stroke: false,
      fillOpacity: 0.75,
      color: getColor(kivaData[i].income_level),
      fillColor: getColor(kivaData[i].income_level),
      radius: markerSize(kivaData[i].income_level)
    })
  );

}

// Create base layers

// Define streetmap, darkmap and satellite map layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA");

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA");

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA");

// Create two separate layer groups below. One for city markers, and one for states markers
var countryLayer = L.layerGroup(countryMarkers);


// Create a baseMaps object to contain the streetmap and darkmap
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satelite Map": satelliteMap
};
// Create an overlayMaps object here to contain the "State Population" and "City Population" layers
var overlayMaps = {
    "Country Income Levels": countryLayer
};
// Modify the map so that it will have the streetmap, states, and cities layers
var myMap = L.map("map", {
    center: [
        37.09, -95.71
      ],
      zoom: 5,
      //layers: [streetmap]
});
console.log(streetmap)
streetmap.addTo(myMap)

// Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
// L.control.layers(baseMaps, overlayMaps).addTo(myMap);
});