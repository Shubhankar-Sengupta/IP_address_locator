// selecting the elements
const btn = document.querySelector('.btn1');
const ip = document.querySelector('.ip');
const loc = document.querySelector('.location');
const time = document.querySelector('.timezone');
const is = document.querySelector('.isp');
const input = document.querySelector('.input-group input');

// regex format using the RegExp constructor we create a new object that we store in the ipformat variable.

// two params that we enter fist is the search pattern and the second one is the flag that we will use and it will mostly be the global one hence g as a type string.


btn.addEventListener('click', async (evt) => {

    // input.value will be a string and match is a method that we can use on that string.

    const ipformat = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "g")

    const domain_format =  new RegExp(/(^https:|http:)\/\/(www|[a-z]{1,}?)(\.[a-zA-Z-_$@+0-9]+)?\.([a-z]{2,3})$/, 'g');

    //match method returns an array.

    const match_domain =  input.value.match(domain_format);

    const match_ip =  input.value.match(ipformat);

    if (match_domain) {

        console.log(match_domain);

    }

    else if (match_ip) {

        // async function ip_func() {

        //     const info = await axios.get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T&ipAddress=${input.value}`); // gets converted into JS object automatically.
        // }
    
    }

        else if (input.value === "") {
            alert("Please enter something valid!!");
        }

        else {
            alert("You have entered an invalid Domain or IP address!");
            return (false);
        }


});


function refresh() {
    input.value = "";
}

window.onload = refresh;



// manipulating them.

async function geoLocation() {

    const info = await axios.get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T`); // gets converted into JS object automatically.

    // console.log(info.data.as.domain);

    const lat = info.data.location.lat;
    const lng = info.data.location.lng;


    const ip_addr = info.data.ip;
    const region = info.data.location.region;
    const time_zone = info.data.location.timezone;
    const isp = info.data.isp;

    ip.innerHTML = ip_addr;
    loc.innerHTML = region;
    time.innerHTML = `UTC ${time_zone}`;
    is.innerHTML = isp;

    return [lat, lng]; // it is returned as a value of the Promise Object and we capture it with then() which accpets a callback.
}


const val = geoLocation();

val.then((value) => {

    const [a, b] = [...value]; // spreading the value inside an array and then deconstructing it into values of a and b.


    // map is generated and as a second option I've passed second argument as options that contains an object literal and prevents the map to be dragged.
    // it returns a map object itself so that we can chain on the methods like here we have setView() method with latitude, longitude and the zoom level.

    var map = L.map('map',
        { 
            keyboard: false, 
            attributionControl:false,
            zoomControl:false,
            dragging:false
        }
    )
        .setView([a, b], 13);


   

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
        iconSize: [45, 56], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var marker = L.marker([a, b], { icon: greenIcon }).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        popup // method chaining is happening here
            .setLatLng(e.latlng) // e is the evetn that happened and .latlng is the porperty on that event.
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);


}).catch((err) => {
    console.log('An Unexpected Error has occured', err.isAxiosError)
})