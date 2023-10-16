import axios from "axios";
const token = localStorage.getItem("authToken");



const fetcher = axios.create({
  headers: { Authorization:token  ?  "Bearer " +token : undefined},
  baseURL: process.env.BASE_PATH,
});

export default fetcher;
