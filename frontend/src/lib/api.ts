import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://projecttask-rrjo.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
