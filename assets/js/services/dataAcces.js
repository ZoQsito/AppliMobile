import  axios from "axios";
const token = window.localStorage.getItem("authToken");

const fetcher =  axios.create({headers:{Authorization: "Bearer " + token}});

export default fetcher;