var capitalUrl = "http://techslides.com/demos/country-capitals.json"

var map = L.map( 'map', {
    center: [20.0, 5.0],
    minZoom: 2,
    zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoic3B1cm9oaXQiLCJhIjoiY2podjRhMGNqMDFndjNxbWRxZjgyN29ociJ9.UgbRyVe42Yu3p2PhiFe-oA", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ["a","b","c"]
    }).addTo(map);