mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "mapShow", // container ID
    style: "mapbox://styles/mapbox/light-v10", // style URL
    // style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: locationJSON.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(locationJSON.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
        }).setHTML(`<h3>${locationJSON.title}</h3><p>${locationJSON.location}</p>`)
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');