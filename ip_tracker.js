// selecting the elements
const btn =  document.querySelector('.btn1');
const ip =  document.querySelector('.ip');
const loc =  document.querySelector('.location');
const time =  document.querySelector('.timezone');
const is =  document.querySelector('.isp');
const input = document.querySelector('.input-group input');

console.log(input);

// manipulating them.

async function GeoLocation() {

    const info = await axios.get('https://geo.ipify.org/api/v2/country?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T'); // gets converted into JS object automatically.
    const ip_addr = info.data.ip;
    const region = info.data.location.region;
    const time_zone = info.data.location.timezone;
    const isp = info.data.isp;

    ip.innerHTML = ip_addr;
    loc.innerHTML = region;
    time.innerHTML = time_zone;
    is.innerHTML = isp;

}

// btn.addEventListener('click', (evt) => {
    
// })

GeoLocation();



// map is generated and as a second option I've passed second argument as options that contains an object literal and prevents the map to be dragged.
// it returns a map object itself so that we can chain on the methods like here we have setView() method with latitude, longitude and the zoom level.

var map = L.map('map', 
{dragging:false}
)
.setView([51.505, -0.09], 13);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2h1Ymhvc2VuIiwiYSI6ImNrd3FpbmNnZjA2bDQybm54c3pnNGg3NjEifQ._wepJJCubol0nCYzvEHjmg'
}).addTo(map);


var greenIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize:     [45, 56], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var marker = L.marker([51.5, -0.09], {icon: greenIcon, draggable:true}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
    popup // method chaining is happening here
        .setLatLng(e.latlng) // e is the evetn that happened and .latlng is the porperty on that event.
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);