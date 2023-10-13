import axios from "axios";
const token = window.localStorage.getItem("authToken");

const fetcher = axios.create({
  headers: { Authorization: "Bearer " + token },
  baseURL: process.env.BASE_PATH,
});

export default fetcher;
