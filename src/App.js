import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ThingSpeakData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  // Replace with your ThingSpeak channel ID and Read API Key
  const channelId = '2680906';
  const readApiKey = 'B5Z08T5E0ZEFN0GX';

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=10`
      );
      setData(response.data.feeds);
    } catch (err) {
      setError('Error fetching data from ThingSpeak.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to fetch data on component mount

  return (
    <div style={{ padding: '20px' }}>
      <h1>ThingSpeak Data</h1>
      {error && <p>{error}</p>}
      {!error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>Field 1</th>
              <th>Field 2</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.entry_id}>
                <td>{entry.entry_id}</td>
                <td>{entry.field1}</td>
                <td>{entry.field2}</td>
                <td>{new Date(entry.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ThingSpeakData;
