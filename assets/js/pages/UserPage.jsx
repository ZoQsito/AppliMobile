import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import usersAPI from "../services/usersAPI";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import RoleAPI from "../services/RoleAPI";

const UserPage = ({ props }) => {
  const { id = "new" } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState([]);

  const [userRole, setUserRole] = useState("");


  const fetchUsers = async (id) => {
    try {
      const { role } = await usersAPI.find(id);
      setUserRole( role["@id"] );
    } catch (error) {
      toast.error("Le user n'a pas pu être chargé");
    }
  };

  const fetchRole = async () => {
    try {
      const data = await RoleAPI.findAll();
      setRole(data);
    } catch (error) {
      toast.error("Les Roles n'ont pas été chargés");
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchUsers(id);
      fetchRole();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await usersAPI.roleUpdate(id, {role:userRole});
      toast.success("Le role du user a bien été modifié");
      navigate("/users");
    } catch ({ error }) {
      toast.error("Le user n'a pas pu être créé");
    }
  };

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;

    setUserRole(selectedValue)

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
              <FormControl fullWidth margin="normal">
                <InputLabel>Roles</InputLabel>
                <Select
                  value={userRole}
                  onChange={handleSelectionChange}
                >
                  <MenuItem value="">Sélectionnez un role</MenuItem>
                  {role.map((role, index) => (
                    <MenuItem key={index} value={role['@id']}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
