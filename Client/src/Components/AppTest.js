import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AppTest.css';

const AppTest = () => {
  const [sensorReadings, setSensorReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSensorData = async () => {
      try {
        const response = await axios.get('http://192.168.30.143:8000/ir-data/');
        console.log(response.data); // Log the response data

        if (isMounted) {
          setSensorReadings(response.data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load sensor data.");
          setLoading(false);
        }
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000);

    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, []);

  const controlServo = useCallback(async (servo, action) => {
    try {
      const angle = action === 'open' ? 180 : 0;
      await axios.post('http://192.168.30.143:8000/servo-command/', {
        [servo]: angle
      });
      alert(`Servo ${servo} ${action}ed successfully.`);
    } catch (err) {
      alert(`Failed to ${action} Servo ${servo}.`);
    }
  }, []);
  

  return (
    <div className="dashboard">
      <h1 className="heading">Sensor Readings</h1>

      <div className="sensors">
        <h2>IR Sensor Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="sensor-table">
            <thead>
              <tr>
                <th>Pin</th>
                <th>Reading</th>
              </tr>
            </thead>
            <tbody>
              {sensorReadings.map((reading, index) => (
                <tr key={index}>
                  <td>{reading.pin}</td>
                  <td>{reading.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="servo-controls">
        <div className="servo">
          <h3>Servo 1 Controls</h3>
          <button onClick={() => controlServo('servo1', 'open')} className="button open">Open</button>
          <button onClick={() => controlServo('servo1', 'close')} className="button close">Close</button>
        </div>
        <div className="servo">
          <h3>Servo 2 Controls</h3>
          <button onClick={() => controlServo('servo2', 'open')} className="button open">Open</button>
          <button onClick={() => controlServo('servo2', 'close')} className="button close">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AppTest;
