import React, { useState, useContext, useEffect } from "react";
import AuthAPI from "../services/AuthAPI";
import Field from "../components/Field";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


const defaultTheme = createTheme();

const LoginPage = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      navigate("/");
    } catch (error) {
      setError(
        "Aucun Compte ne possède cette adresse ou alors les informations ne correspondent pas !"
      );
    }
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              label="Identifiant"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Identifiant de connexion"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Mot de Passe"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              type="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se Connecter
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </>
  );
};

export default LoginPage;
