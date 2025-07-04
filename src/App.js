import React, { useState, useRef } from "react";

const App = () => {
  const [vehicleId, setVehicleId] = useState("");
  const [status, setStatus] = useState("Idle");
  const intervalRef = useRef(null);

  const startTracking = () => {
    if (!vehicleId) {
      alert("Enter Vehicle ID");
      return;
    }

    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const payload = {
            vehicleId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timestamp: new Date().toISOString()
          };

          fetch("https://locationtracker-m9ig.onrender.com/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }).then(() => {
            setStatus("Last sent: " + new Date().toLocaleTimeString());
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
    </div>
  );
};

export default App;
