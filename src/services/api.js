import axios from "axios";

const API = axios.create({
  baseURL: "https://cerebrovisceral-mystically-shirlene.ngrok-free.dev/api", 
  headers: {
    Accept: "application/json",
  },
});

export default API;