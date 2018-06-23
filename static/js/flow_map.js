/*
<Chan Feng> 2018-06-04 Rutgers Data Science Data Visualization Bootcamp

Ref for flow on map: http://bl.ocks.org/Andrew-Reid/8de4b9d0d0a87a478770e0cc86e2f5e4
Ref: https://github.com/jwasilgeo/Leaflet.Canvas-Flowmap-Layer


*/

// Store our API endpoint as earthquakeUrl
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
const tectonicUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'

const COLORS = [ '#B5F050', '#DDF051', '#ECD650', '#E9B24E', '#E59F66', '#E16364', ]
const LABELS = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']


// Define base map layer
const TOKEN = "access_token=pk.eyJ1IjoiZmVuZzQ0MyIsImEiOiJjamh2NDd3b2owdmNhM2tsNjA1dG0wcm8xIn0.XhlIawfI8vpUvUrSkpnIng"
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" + TOKEN)
var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" + TOKEN)
var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + TOKEN)
 baseMaps = {
    'Satellite': satelliteMap,
    'Greyscale': greyscaleMap,
    'Outdoors': outdoorsMap,
}

var yearURL = 'data/year'
var regionURL = 'data/region'
var mapURL = 'data/map/2016/f'

// Dynamically create circle options
function getCircleOptions(feature) {
    mag = Math.abs(feature.properties.mag) // Occasionally mag is negative
    i = Math.floor(mag)
    var i = i > 5 ? 5 : Math.floor(mag)
    return {
        radius: Math.sqrt(mag) * 10,
        color: 'grey',
        fillColor: COLORS[i],
        opacity: 1,
        fillOpacity: 0.8,
        weight: 2,
    }
}

// Marker popup
function getPopup(feature) {
    let title = feature.properties.title
    let detail = feature.properties.detail
    return `<h2><a href=${detail} target=_new>${title}</a></h2>`
}

function getLoanLayer(data) {

    var markers = []
    data.forEach( d => {
        console.log(d)
        latlng = [d.latitude, d.longitude]
        markers.push(
            L.circle(latlng, {
                radius: Math.sqrt(d.loan_amount) * 50
            }
            )
        )
    })


    // Parse time automatically for time dimension control
    //return L.timeDimension.layer.geoJson(earthquakeLayer, {duration: 'PT4H'})
    loanLayer = L.layerGroup(markers)
    return loanLayer
}

function getLegend() {
    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        labels = []
        COLORS.forEach(function (color, i) {
            labels.push('<li><span style="background-color: ' + color + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + LABELS[i] + '</li>')
        })
        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
    }
    return legend
}

// Use d3.queue() to handle multiple data sources
d3.queue()
.defer(d3.json, yearURL)
.defer(d3.json, mapURL)
.await(function(error, years, data) {

    loanLayer = getLoanLayer(data)

    var overlayMap = {
        'Loan Size': loanLayer
    }

    // Create a new map
    var myMap = L.map("map", {
        center: [ 37.09, -10 ], // Adjust center to show most of world map in a typical screen
        zoom: 3,
        layers: [outdoorsMap, loanLayer],
        timeDimension: true,
        timeDimensionControl: true,
        timeDimensionOptions: {
            period: 'PT1H'
        },
        timeDimensionControlOptions: {
            autoPlay: true,
            playerOptions: {
                buffer: 10,
                transitionTime: 400,
                loop: true,
        }
    },
    })

    // Create a layer control containing our baseMaps
    // Be sure to add an overlay Layer containing the earthquake GeoJSON
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap)

    //getLegend().addTo(myMap)
})