import axios from "axios";

const API = axios.create({
  baseURL: "https://cerebrovisceral-mystically-shirlene.ngrok-free.dev/api", 
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    // ✅ ADDED THIS: This skips the ngrok "warning" page that blocks your app
    "ngrok-skip-browser-warning": "true", 
  },
});


export default API;