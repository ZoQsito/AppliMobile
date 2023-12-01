import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RoleAPI from "../services/RoleAPI";
import ServiceAPI from "../services/ServiceAPI";
import usersAPI from "../services/usersAPI";

const UserForm = (props) => {
  const { isAdmin, setIsAuthenticated, isAuthenticated, decodedToken } =
    useAuth();

  const initialState = {
    username: "",
    email: "",
    numero: "",
    role: "",
    service: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [roles, setRoles] = useState();
  const [services, setServices] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      setIsEditing(true);
    }
    fetchUsersId();
  }, [props.user]);

  const fetchUsersId = async () => {
    try {
      setUserData({
        username: props.user.username,
        email: props.user.email,
        numero: props.user.numero,
        role: props.user.role["@id"],
        service: props.user.service["@id"],
      });
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      const roles = await RoleAPI.findAll();
      const services = await ServiceAPI.findAll();
      setRoles(roles);
      setServices(services);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await usersAPI.update(props.user.id, userData);
        setUserData(initialState);
        props.onClose();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      try {
        await usersAPI.register(userData);
        setUserData(initialState);
        navigate("/users");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" mb={3}>
              {isEditing ? "Modification du User" : "Création d'un User"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    rows={4}
                    label="Username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    rows={4}
                    label="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    rows={4}
                    label="Numero de Téléphone"
                    name="numero"
                    value={userData.numero}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={userData.role}
                      name="role"
                      onChange={handleInputChange}
                      id="role"
                      defaultValue={""}
                    >
                      <MenuItem value="">Sélectionnez un Role</MenuItem>
                      {roles?.map((role, index) => (
                        <MenuItem key={index} value={role["@id"]}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Service</InputLabel>
                    <Select
                      value={userData.service}
                      name="service"
                      onChange={handleInputChange}
                      id="service"
                      defaultValue={""}
                    >
                      <MenuItem value="">Sélectionnez un Service</MenuItem>
                      {services?.map((service, index) => (
                        <MenuItem key={index} value={service["@id"]}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    {isEditing ? "Modifier User" : "Créer User"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UserForm;
