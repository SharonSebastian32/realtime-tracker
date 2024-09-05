// const socket = io();

// socket.on("connect", () => {
//   console.log("Connected to server");
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.log(error);
//     },
//     {
//       enableHighAccuracy: true,
//       maximumAge: 0,
//       timeout: 5000,
//     }
//   );
// }

// const map = L.map("map").setView([0, 0], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "openStreetMap",
// }).addTo(map);

// const markers = {};

// socket.on("receive-location", (data) => {
//   const { id, latitude, longitude } = data;
//   map.setView([latitude, longitude], 16);
//   if (markers[id]) {
//     markers[id].setLatLng(latitude, longitude);
//   } else {
//     markers[id] = L.marker([latitude, longitude]).addTo(map);
//   }
// });

const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

// Initialize the map
const map = L.map("map").setView([0, 0], 16);

// Set up the OpenStreetMap layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

// Store markers for each user
const markers = {};

// Handle receiving location data from the server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Set the map view to the current location
  map.setView([latitude, longitude], 16);

  // If a marker for this user exists, update its position
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Update marker position
  } else {
    // Otherwise, create a new marker
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
