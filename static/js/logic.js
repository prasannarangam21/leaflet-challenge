// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 3,
    layer: greymap
});

// Adding tile layer
var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

greymap.addTo(myMap);

// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    console.log(data);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map

    function radius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }
    function color(magnitude) {
        switch (true) {
            case magnitude >= 5:
                return '#EA2C2C';
            case magnitude >= 4:
                return '#EA822C';
            case magnitude >= 3:
                return '#EE9C00';
            case magnitude >= 2:
                return '#EECC00';
            case magnitude >= 1:
                return '#D4EE00';
            default:
                return '#98EE00';

        }
    }

    function circleStyle(feature) {
        return {
            fillColor: color(feature.properties.mag),
            radius: radius(feature.properties.mag),
            fillOpacity: 1,
            weight: 0.5,
            stroke: true
        };
    }

    // Add legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 1, 2, 3, 4, 5];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mags.length; i++) {

            div.innerHTML +=
                "<i style='background:" + color(mags[i]) + "'></i> " +
                mags[i] + (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
        }

        return div;
    };

    legend.addTo(myMap);

    var earthquakeLayer = L.geoJSON(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: circleStyle,
         // Give each feature a popup describing with information pertinent to it
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr/><p>${feature.properties.mag}</p>`)
        }
    })

    earthquakeLayer.addTo(myMap);
    
});
