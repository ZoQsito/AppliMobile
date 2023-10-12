import React, { useState, useEffect } from "react";
import Field from "../components/Field";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import usersAPI from "../services/usersAPI";

const UserPage = ({ props }) => {
  const { id = "new" } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    plainPassword: "",
    roles: [],
    email:"",
  });

  const [userRole, setUserRole] = useState({
    roles: [],
  });

  const [errors, setErrors] = useState({
    username: "",
    plainPassword: "",
  });

  const [editing, setEditing] = useState(false);

  const fetchUsers = async (id) => {
    try {
      const { username, roles, password, email } = await usersAPI.find(id);
      setUser({ username, roles, password, email });
      setUserRole({ roles });
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
      const rolesArray = value.split(",").map((role) => role.trim()); 
      setUser({ ...user, [name]: rolesArray });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleChangeModif = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    if (name === "roles") {
      const rolesArray = value.split(",").map((role) => role.trim());
      setUserRole({ ...userRole, [name]: rolesArray });
    } else {
      setUserRole({ ...userRole, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (user.roles.length === 0) {
      user.roles = [];
    }

    try {

      if (editing) {
        console.log(userRole)
        await usersAPI.update(id, userRole);
        toast.success("Le role du user a bien été modifié");
        navigate("/users");
      } else {
        await usersAPI.register(user);
        toast.success("Le user a bien été créé");
        navigate("/users");
      }
    } catch ({ error }) {
      toast.error("Le user n'a pas pu être créé");
    }
  };

  return (
    <>
      {(!editing && (
        <>
          <h1>Ajout d'un User</h1>
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
              name="email"
              label="Email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
            &nbsp;
            <Field
              name="plainPassword"
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
              value={user.roles}
              onChange={handleChange}
            />
            &nbsp;
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Enregistrer
              </button>
              <Link to="/users" className="btn btn-link">
                Retour à la liste
              </Link>
            </div>
          </form>
        </>
      )) || (
        <>
          <h1>Modification du role d'un User</h1>
          <form onSubmit={handleSubmit}>
            <Field
              name="roles"
              label="Role"
              placeholder="Role du User"
              value={userRole.roles[0]}
              onChange={handleChangeModif}
            />
            &nbsp;
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Enregistrer
              </button>
              <Link to="/users" className="btn btn-link">
                Retour à la liste
              </Link>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default UserPage;
