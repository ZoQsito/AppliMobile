import jwtDecode from "jwt-decode";
import fetcher from "./dataAcces";




function logout(){
    window.localStorage.removeItem("authToken");
    delete fetcher.defaults.headers["Authorization"];
}

function authenticate(credentials) {
    return fetcher
      .post("/api/login_check", credentials)
      .then(response => response.data.token)
      .then(token => {
        window.localStorage.setItem("authToken", token);
        fetcher.defaults.headers["Authorization"] = "Bearer " + token;
        return true;
      })
      .catch(error => {
        console.error("Erreur lors de l'authentification :", error);
        return false;
      });
  }


function setup(){
    const token = window.localStorage.getItem("authToken");

    if(token){
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()){
            fetcher.defaults.headers["Authorization"] = "Bearer " + token;
            console.log("Connexion établie avec fetcher");
        } else {
            logout();
        }
        
    }
        
}


function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");

    if(token){
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()){
            return true
        }else{
        return false
        }
        
    }else{
    return false
    }
}


export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
}