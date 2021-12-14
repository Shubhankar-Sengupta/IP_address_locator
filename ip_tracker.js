// selecting the elements
const btn = document.querySelector('.btn1');
const ip = document.querySelector('.ip');
const loc = document.querySelector('.location');
const time = document.querySelector('.timezone');
const is = document.querySelector('.isp');
const input = document.querySelector('.input-group input');



// manipulating them.

async function geoLocation() {

    const info = await axios.get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T`); // gets converted into JS object automatically.
    return fetch_data(info);
    // it is returned as a value of the Promise Object and we capture it with then() which accpets a callback.
}

// returns the latitude and the longitude.
const lat_lng = geoLocation(); // functions are special objects that are meant to be executed.

lat_lng.then((value) => {

    const [lat, lng] = value;

    // creation of map object

    const map = L.map('mymap', { zoomControl:false,  attributionControl:false, dragging:false}).setView([lat, lng], 13);
    const url =  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

    const attribution =  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    const id = 'mapbox/streets-v9';
    const access_token = 'pk.eyJ1Ijoic2h1Ymhvc2VuIiwiYSI6ImNrd3FpbmNnZjA2bDQybm54c3pnNGg3NjEifQ._wepJJCubol0nCYzvEHjmg'; // mapbox access token.

    // created tile for the map.
    const tile = L.tileLayer(url, {attribution: attribution, maxZoom: 18, id: id, tileSize: 512, zoomOffset: -1, accessToken: access_token}).addTo(map);


    //Custom icon.
    const black_icon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [44, 54],
        iconAnchor: [22, 27],
    });;


    // Creation of marker object.
    const marker  = L.marker([lat, lng], {icon:black_icon}).addTo(map);
    marker.bindPopup(`You are here: ${[lat, lng]}`).openPopup();


    // marker moveEvent.

    function move_marker_event() {

        marker.once('move', (evt) => {

            const radius = evt.accuracy;

            alert(`moved ${evt.latlng}`);
            marker
            .bindPopup(`You are here: ${evt.latlng}`)
            .openPopup();

            L.circle(evt.latlng, radius).addTo(map);
        })

    }

    // executing the function.
    move_marker_event();


    // Popup events

    function onMapClick(evt) {

        // Creation of Popup object.
        const popup = L.popup();

        //chained methods.
        popup
        .setLatLng(evt.latlng)
        .setContent(`You clicked at: ${evt.latlng}`)
        .openOn(map)

    }

    map.on('locationfound', onMapClick);
    

    function onLocationError(e) {
        alert(e.message);
    }
    
    map.on('locationerror', onLocationError);


    
btn.addEventListener('click', async (evt) => {

    // regex format using the RegExp constructor we create a new object that we store in the ipformat variable.

    // two params that we enter fist is the search pattern and the second one is the flag that we will use and it will mostly be the global one hence g as a type string.
    

    const ipformat = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "g")

    const domain_format =  new RegExp(/^([a-zA-Z-_$@+0-9]+)\.([a-z]{2,3})$/, 'g'); // it makes a global match.


    // input.value will be a string and match is a method that we can use on that string.

    //match method returns an array.

    const match_domain =  input.value.match(domain_format);

    const match_ip =  input.value.match(ipformat);


    async function get_from_input_data(url, config) {
        
        const info = await axios.get(url, config);
        const data = fetch_data(info);
        const [lt, lng] =  data;
        map.panTo([lt,lng]);
        marker.setLatLng([lt,lng]);

        // marker moveEvent.
        move_marker_event();
    }

        if (match_domain) {
            const inputs_1 = {params: { domain:input.value }};
            get_from_input_data(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T`, inputs_1); 

        }

    

        else if (match_ip) {

            const inputs_2 = {params: { ipAddress:input.value }};
            get_from_input_data(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T`, inputs_2);
        }

        else if (input.value === "") {
            alert("Please enter something valid!!");
            return false;
        }

        else {
            alert("You have entered an invalid Domain or IP address!");
            return false;
        }

});
    

}).catch((err) => {
    alert("Sorry unable to process", err);
})


function Settings_card_timings(obj, value) {
    obj.innerHTML = value;
}


function fetch_data(info) {

    const main_object = {

        a: info.data.location.lat,
        b: info.data.location.lng,
        c: info.data.ip,
        d: info.data.location.region,
        e: info.data.location.timezone,
        f: info.data.isp
    }

    const {a:lat, b:lng, c:ip_addr, d:region, e:time_zone, f:isp} = main_object; // Destructuring object with custom names.

    Settings_card_timings(ip, ip_addr);
    Settings_card_timings(loc, region);
    Settings_card_timings(is, isp);
    Settings_card_timings(time, `UTC ${time_zone}`);

    return [lat, lng];

}



// refreshing the input value.

function refresh() {
    input.value = "";
}

// onload() function.
window.onload = refresh;