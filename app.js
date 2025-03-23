let map;
let userLocation;
let markers = [];
let driverIcon;

function initMap() {
    // Initialize the Leaflet map with OpenStreetMap tiles
    map = L.map('map').setView([40.7128, -74.0060], 12); // Default to New York

    // Set up the tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a zoom control to the map
    L.control.zoom().addTo(map);

    // Set up custom icon for drivers (using an SVG from your local machine)
    driverIcon = L.icon({
        iconUrl: 'car-pn.png', // Path to your local SVG icon
        iconSize: [30, 30], // Adjust size of the icon
        iconAnchor: [15, 30], // Set the anchor point (the bottom center)
        popupAnchor: [0, -30] // Popup position relative to the icon
    });

    // Add event listener to the "Get My Location" button
    document.getElementById("get-location-btn").addEventListener("click", getUserLocation);
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Center the map on the user's location
                map.setView([userLocation.lat, userLocation.lng], 14);

                // Add a marker for the user's location
                L.marker([userLocation.lat, userLocation.lng]).addTo(map)
                    .bindPopup("You are here")
                    .openPopup();

                // Call function to show nearby drivers within 500m radius
                showNearbyDrivers(userLocation, 50, 500);
            },
            () => {
                alert("Error: The Geolocation service failed.");
            }
        );
    } else {
        alert("Error: Your browser does not support geolocation.");
    }
}

// Function to show multiple nearby drivers within a given radius
function showNearbyDrivers(location, numberOfDrivers, radius) {
    // Remove old markers if there are any
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Generate random driver locations within the given radius (in meters)
    for (let i = 0; i < numberOfDrivers; i++) {
        const randomLocation = getRandomLocationInRadius(location, radius);
        const driverMarker = L.marker([randomLocation.lat, randomLocation.lng], {icon: driverIcon})
            .addTo(map)
            .bindPopup("Nearby Driver");

        markers.push(driverMarker);
    }
}

// Function to generate a random location within a given radius in meters
function getRandomLocationInRadius(center, radius) {
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomDistance = Math.random() * radius; // Random distance within the radius (in meters)

    const latOffset = (randomDistance / 111320) * Math.cos(randomAngle); // Approximate conversion from meters to latitude
    const lngOffset = (randomDistance / 111320) * Math.sin(randomAngle); // Approximate conversion from meters to longitude

    return {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset
    };
}

// Initialize the map on page load
window.onload = initMap;
