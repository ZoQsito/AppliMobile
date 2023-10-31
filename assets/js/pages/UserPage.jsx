import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import usersAPI from "../services/usersAPI";

const UserPage = ({ props }) => {
  const { id = "new" } = useParams();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState({
    roles: [],
  });

  const fetchUsers = async (id) => {
    try {
      const {roles} = await usersAPI.find(id);
      setUserRole({ roles });
    } catch (error) {
      toast.error("Le user n'a pas pu être chargé");
    }
  };

  

  useEffect(() => {
    if (id !== "new") {
      fetchUsers(id);
    }
  }, [id]);

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

    if (userRole.roles.length === 0) {
      userRole.roles = [];
    }

    try {
      await usersAPI.roleUpdate(id, userRole);
      toast.success("Le role du user a bien été modifié");
      navigate("/users");
    } catch ({ error }) {
      toast.error("Le user n'a pas pu être créé");
    }
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={10} md={6}>
          <Paper elevation={3} style={{ padding: "20px", margin: "30px" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Modification du rôle du User
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="roles"
                label="Rôle"
                placeholder="Rôle du User"
                fullWidth
                value={userRole.roles}
                onChange={handleChangeModif}
                variant="outlined"
                margin="normal"
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button type="submit" variant="contained" color="primary">
                  Enregistrer
                </Button>
                <Link to="/users" style={{ textDecoration: "none" }}>
                  <Button variant="text" color="secondary">
                    Retour à la liste
                  </Button>
                </Link>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default UserPage;
