import React, { useState, useContext, useEffect } from "react";
import AuthAPI from "../services/AuthAPI";
import Field from "../components/Field";
import AuthContext from "../contexts/AuthContext";


const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext)


  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        await AuthAPI.authenticate(credentials);
        setError("");
        setIsAuthenticated(true);
        window.location.href = "/";
    } catch (error) {
        setError("Aucun Compte ne possède cette adresse ou alors les informations ne correspondent pas !");
    }
}


  return (
    <>
      <h1>Connexion à l'application</h1>&nbsp;
      <form onSubmit={handleSubmit}>
        <Field
          label="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="username de connexion"
        />
        &nbsp;
        <Field
          label="Mot de Passe"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          type="password"
        />
        &nbsp;
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Connexion
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
