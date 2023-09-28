import React, { useState, useEffect } from "react";
import Field from "../components/Field";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import usersAPI from "../services/usersAPI";

const UserPage = ({ props }) => {
  const { id = "new" } = useParams();

  const [user, setUser] = useState({
    username: "",
    password: "",
    roles: [],
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    roles: [],
  });

  const [editing, setEditing] = useState(false);


  const fetchUsers = async (id) => {
    try {
      const { username, roles, password } = await usersAPI.find(id);
      setUser({ username, roles, password });
    } catch (error) {
      toast.error("Le user n'a pas pu être chargé");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchUsers(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;


    if (name === "roles") {
      const rolesArray = value.split(',').map((role) => role.trim()); 
      setUser({ ...user, [name]: rolesArray });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (user.roles.length === 0) {
      user.roles = [];
    }

    console.log(user)
  
    try {
      setErrors({});
      if (editing) {
        const { password: currentPassword } = await usersAPI.find(id);
  
        if (user.password === currentPassword) {
          user.password = null;
        }
  
        await usersAPI.update(id, user);
  
        toast.success("Le user a bien été modifié");
      } else {
        await usersAPI.register(user);
        toast.success("Le user a bien été créé");
        window.location.href = "/users";
      }
    } catch ({ error }) {
      toast.error("Le user n'a pas pu être créé");
    }
  };

  return (
    <>
      {(!editing && <h1>Ajout d'un User</h1>) || (
        <h1>Modification d'un User</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          label="Username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
          error={errors.username}
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
          name="roles"
          label="Role"
          placeholder="Role du User"
          value={user.roles.join(', ')} 
          onChange={handleChange}
        />
        &nbsp;
        <div className="form-group">
          <Link to="/users" className="btn btn-success" onClick={handleSubmit}>
            Enregistrer
          </Link>
          <Link to="/users" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default UserPage;
