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

    const map = L.map('mymap', { zoomControl:false,  attributionControl:false }).setView([lat, lng], 13);
    const url =  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

    const attribution =  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    const id = 'mapbox/streets-v9';
    const access_token = 'pk.eyJ1Ijoic2h1Ymhvc2VuIiwiYSI6ImNrd3FpbmNnZjA2bDQybm54c3pnNGg3NjEifQ._wepJJCubol0nCYzvEHjmg'; // mapbox access token.


    const tile = L.tileLayer(url, {attribution: attribution, maxZoom: 18, id: id, tileSize: 512, zoomOffset: -1, accessToken: access_token}).addTo(map);


    //Custom icon.
    const black_icon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [44, 54],
        iconAnchor: [22, 27],
    });;


    // Creation of marker object.
    const marker  = L.marker([lat, lng], {icon:black_icon}).addTo(map);



    // regex format using the RegExp constructor we create a new object that we store in the ipformat variable.

    // two params that we enter fist is the search pattern and the second one is the flag that we will use and it will mostly be the global one hence g as a type string.


btn.addEventListener('click', async (evt) => {

    // input.value will be a string and match is a method that we can use on that string.

    const ipformat = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "g")

    const domain_format =  new RegExp(/^([a-zA-Z-_$@+0-9]+)\.([a-z]{2,3})$/, 'g'); // it makes a global match.

    //match method returns an array.

    const match_domain =  input.value.match(domain_format);

    const match_ip =  input.value.match(ipformat);

    if (match_domain) {

        const info = await axios.get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T&domain=${input.value}`);
        const data = fetch_data(info);
        const [lt, lng] =  data;
        map.panTo([lt,lng]);
        marker.setLatLng([lt,lng]);

    }

    else if (match_ip) {

        const info = await axios.get(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RKNbx052tbn7KTfMkIEX3W5Fo3Z1T&ipAddress=${input.value}`);
        
        const data = fetch_data(info);
        const [lt, lng] =  data;
        map.panTo([lt,lng]);
        marker.setLatLng([lt,lng]);

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


function fetch_data(info) {

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
    return [lat, lng];

}



function refresh() {
    input.value = "";
}

window.onload = refresh;