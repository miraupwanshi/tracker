import React, { useState, useRef } from "react";
import axios from "axios";

const App = () => {
  const [vehicleId, setVehicleId] = useState("");
  const [status, setStatus] = useState("Idle");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const intervalRef = useRef(null);

  const startTracking = () => {
    if (!vehicleId) {
      alert("Enter Vehicle ID");
      return;
    }

    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const payload = {
            vehicleId,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          };

          // Update location on UI
          setLocation({ latitude, longitude });

          // Log for verification
          console.log("Sending GPS Data:", payload);

          // Send data to backend
          axios.post("https://locationtracker-m9ig.onrender.com/api/location", payload)
            .then(() => {
              setStatus("Last sent: " + new Date().toLocaleTimeString());
            })
            .catch(err => {
              setStatus("Error sending data: " + err.message);
            });
        },
        err => setStatus("GPS Error: " + err.message),
        { enableHighAccuracy: true }
      );
    }, 5000);

    setStatus("Tracking started...");
  };

  const stopTracking = () => {
    clearInterval(intervalRef.current);
    setStatus("Tracking stopped.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Truck GPS Tracker</h2>
      <input
        type="text"
        placeholder="Vehicle ID"
        value={vehicleId}
        onChange={e => setVehicleId(e.target.value)}
      />
      <br /><br />
      <button onClick={startTracking}>Start</button>
      <button onClick={stopTracking} style={{ marginLeft: 10 }}>Stop</button>
      <p>{status}</p>
      {location.latitude && location.longitude && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default App;
