// config.js
import axios from 'axios';

const channelId = '2680906';
const readApiKey = 'B5Z08T5E0ZEFN0GX';

export const fetchData = async () => {
  try {
    const response = await axios.get(
      `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=10`
    );
    return response.data.feeds;
  } catch (err) {
    console.error('Error fetching data from ThingSpeak:', err);
    throw new Error('Error fetching data from ThingSpeak.');
  }
};
