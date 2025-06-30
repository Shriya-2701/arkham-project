import axios from "axios";

// 1. News Bias Detection
export const detectNewsBias = async (text: string) => {
  try {
    const response = await axios.post(
      "https://spectrum-api-343916782787.us-central1.run.app",
      { text }
    );
    return response.data;
  } catch (err) {
    console.error("Bias detection failed", err);
    throw err;
  }
};

// 2. Social Media Connection
export const connectSocialMedia = async (username: string) => {
  try {
    const response = await axios.get(
      `https://connection-api-343916782787.us-central1.run.app?username=${username}`
    );
    return response.data;
  } catch (err) {
    console.error("Social connection failed", err);
    throw err;
  }
};

// 3. Live Navigation
export const getLiveNavigation = async (lat: number, lng: number) => {
  try {
    const response = await axios.post(
      "https://live-map-343916782787.us-central1.run.app",
      { lat, lng }
    );
    return response.data;
  } catch (err) {
    console.error("Live navigation failed", err);
    throw err;
  }
};