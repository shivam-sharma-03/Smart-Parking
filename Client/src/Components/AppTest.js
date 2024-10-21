import React, { useEffect, useState } from 'react';

const AppTest = () => {
    const [latestIrData, setLatestIrData] = useState({
        nodemcu: null,
        raspberry_pi: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://192.168.30.143:8000/ir-data/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const data = await response.json();
                setLatestIrData(data); // Update the state with data from both sources
            } catch (error) {
                console.error(error.message);
            }
        };

        const interval = setInterval(fetchData, 1000); // Poll every second

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    return (
        <div className="App">
            <h1>Latest IR Sensor Data</h1>
            <div>
                <h2>NodeMCU</h2>
                {latestIrData.nodemcu && latestIrData.nodemcu.sensor_value ? (
                    <p>
                        Sensor Value: {latestIrData.nodemcu.sensor_value} at{' '}
                        {new Date(latestIrData.nodemcu.timestamp).toLocaleString()}
                    </p>
                ) : (
                    <p>No data available</p>
                )}
            </div>
            <div>
                <h2>Raspberry Pi</h2>
                {latestIrData.raspberry_pi && latestIrData.raspberry_pi.sensor_value ? (
                    <p>
                        Sensor Value: {latestIrData.raspberry_pi.sensor_value} at{' '}
                        {new Date(latestIrData.raspberry_pi.timestamp).toLocaleString()}
                    </p>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default AppTest;
