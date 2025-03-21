import axios, { AxiosInstance } from "axios";

const url = "https://api.scryfall.com";

const api: AxiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json;q=0.9,*/*;q=0.8",
  },
});

export default api;
