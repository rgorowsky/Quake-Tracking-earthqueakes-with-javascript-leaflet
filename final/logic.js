// Create a map object
// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 3
// });

// create link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//pull in the information from the json
d3.json(url, function(data) {
  //create the features from this information
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // var platesData=plates.features;
  //initialize the new data
  function eachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
  }

function markerOptions(feature) {
  if (feature.properties.mag<=1){v_fillcolor="yellow";}
  if (feature.properties.mag>3 && feature.properties.mag<=3){v_fillcolor="orange";}
  if (feature.properties.mag>5){v_fillcolor="red";}
  var geojsonMarkerOptions = {
    radius: feature.properties.mag*3,
    fillColor: v_fillcolor,
    color: "#000",
    weight: .5,
    opacity: 1,
    fillOpacity: 0.8
  };
  return geojsonMarkerOptions;
}
var earthquakes = L.geoJSON(earthquakeData,
  {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, markeropt(feature));}
  });
  //initialize plates
  var eqplates = L.geoJSON(platesData);

  createImageBitmap(earthquakes,eqplates);

}

function createMap(earthquakes,eqplates) {
  // Define streetmap and darkmap layers
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmxhdWFuIiwiYSI6ImNqYWthMDZ4dTJoNmgzMm8ydThhNGNuYmoifQ.OTkgOVoygYetzPC9ge2Q3Q");
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmxhdWFuIiwiYSI6ImNqYWthMDZ4dTJoNmgzMm8ydThhNGNuYmoifQ.OTkgOVoygYetzPC9ge2Q3Q");
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZmxhdWFuIiwiYSI6ImNqYWthMDZ4dTJoNmgzMm8ydThhNGNuYmoifQ.OTkgOVoygYetzPC9ge2Q3Q");
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellite,
    "Grayscale": darkmap,
    "Outdoors": outdoors
  
  };
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": eqplates
  };
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [satellite,eqplates,earthquakes]
  });
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
  
  function addlegends(){
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        var bcolor="";
        var lbl="";
        div.innerHTML='<font size=3 color=red>Magnitude:</font><br>';
        for (var i = 0; i < grades.length; i++) 
        {
            if (grades[i]==0){bcolor="lightgreen";lbl="0-1"}
            if (grades[i]==1){bcolor="green";lbl="1-2"}
            if (grades[i]==2){bcolor="lightblue";lbl="2-3"}
            if (grades[i]==3){bcolor="blue";lbl="3-4"}
            if (grades[i]==4){bcolor="purple";lbl="4-5"}
            if (grades[i]==5){bcolor="red";lbl="5+"}
            div.innerHTML += '<font size=2 color="' + bcolor + '">'+lbl+'</font>' + '<br>';
        }
    return div;
    };
    legend.addTo(myMap);
  }
  addlegends();
  //Adding Slider
  // function getColorFor(str) { // java String#hashCode
  // var hash = 0;
  // for (var i = 0; i < str.length; i++) {
  //   hash = str.charCodeAt(i) + ((hash << 5) - hash);
  // }
  // var red = (hash >> 24) & 0xff;
  // var grn = (hash >> 16) & 0xff;
  // var blu = (hash >>  8) & 0xff;
  // return 'rgb(' + red + ',' + grn + ',' + blu + ')';
  // } 
  // // var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  // // var osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  // // var osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
  // // var map = L.map('map', {layers: [osm], center: new L.LatLng(0,0), zoom: 2 });
  // var timeline;
  // var timelineControl;
  // function onLoadData(data)
  // { 
  //   timeline = L.timeline(data, 
  //   {
  //     style: function(data)
  //     {
  //       return new
  //       {
  //         stroke: false,
  //         color: getColorFor(data.properties.name),
  //         fillOpacity: 0.5
  //       }
  //     },
  //     waitToUpdateMap: true,
  //     onEachFeature: function(feature, layer) 
  //     {
  //       layer.bindTooltip(feature.properties.name);
  //     }
  //   });
  //   timelineControl = L.timelineSliderControl(
  //   {
  //       formatOutput: function(date) 
  //       {
  //         return new Date(date).toLocaleDateString();
  //       },
  //       enableKeyboardControls: true,
  //   });
  //   timeline.addTo(myMap);
  //   timelineControl.addTo(myMap);
  //   timelineControl.addTimelines(timeline);
  // }
  
  // onLoadData(L.geoJSON(usgs_data));
}
// addslider();