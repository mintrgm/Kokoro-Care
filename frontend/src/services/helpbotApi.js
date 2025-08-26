import axios from "axios";

const helpbotApi = axios.create({
  baseURL: import.meta.env.VITE_HELPBOT_API_URL || "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default helpbotApi;
