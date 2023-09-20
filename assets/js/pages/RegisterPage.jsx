import React, { useState } from "react";
import Field from "../components/Field";
import { Link } from "react-router-dom";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre Confirmation de Mot de Passe n'est pas comforme avec le Mot de Passe";
      setErrors(apiErrors);
      toast.error("Des erreurs dans votre Formulaire !😠");
      return;
    }

    await usersAPI.register(user);

  };

  return (
    <>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          label="Username"
          placeholder="Votre Username"
          error={errors.username}
          value={user.username}
          onChange={handleChange}
        />
        &nbsp;
        <Field
          name="email"
          label="Email"
          placeholder="Votre Email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        &nbsp;
        <Field
          name="password"
          type="password"
          label="Password"
          placeholder="Votre Mot de Passe"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        &nbsp;
        <Field
          name="passwordConfirm"
          type="password"
          label="PasswordConfirm"
          placeholder="Comfirmer votre Mot de Passe"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        &nbsp;
        <div className="mb-5 mt-4 form-group">
          <button type="submit" className="btn btn-outline-success">
            Inscription
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai Déjà un Compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
