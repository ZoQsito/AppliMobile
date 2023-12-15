import axios from "axios";
const token = localStorage.getItem("authToken");



const fetcher = axios.create({
  headers: { Authorization:token  ?  "Bearer " +token : undefined, "Content-Type" : "application/ld+json"},
  baseURL: process.env.BASE_PATH,
  
});

export const fetcherPatch = axios.create({
  headers: { Authorization:token  ?  "Bearer " +token : undefined, "Content-Type" : "application/merge-patch+json"},
  baseURL: process.env.BASE_PATH,
  
});

export default fetcher;
