import axios from "axios";

// Force the correct API URL for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://eventx-system.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("🔗 API Request to:", config.baseURL + config.url);
  return config;
});

console.log("🔗 Environment VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("🔗 Axios Base URL:", axiosInstance.defaults.baseURL);

export default axiosInstance;


