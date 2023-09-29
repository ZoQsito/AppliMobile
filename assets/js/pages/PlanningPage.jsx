import React, { useState, useEffect} from "react";
import PlanningEditable from "../components/PlanningEditable";
import jwtDecode from "jwt-decode";
import PlanningOnlyView from "../components/PlanningOnlyView";
import AuthAPI from "../services/AuthAPI";
import PlanningComponent from "../components/PlanningComponent";

function Planning() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const [isResp, setIsResp] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem("authToken");

    if (token) {
      var decodedToken = jwtDecode(token);
      if (decodedToken.roles[0] === "ADMIN") {
        setIsAdmin(true);
      }

      if (decodedToken.roles[0] === "RESP") {
        setIsResp(true);
      }
    }
  }, [isAuthenticated]);
  
  return (<>
  
  {isAdmin || isResp ? (
      <PlanningComponent />
    ) : (
      <PlanningComponent />
    )}

  </>
  );
}

export default Planning;
