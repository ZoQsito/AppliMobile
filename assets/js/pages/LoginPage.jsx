import React, { useState } from "react";
import AuthAPI from "../services/AuthAPI";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CustomizedSnackbars from "../components/CustomizedSnackbars";


const LoginPage = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setErrorOccurred(true);
      setErrorMessage("Une erreur s'est produite. Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <>
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontFamily: '"Lexend-SemiBold", sans-serif',
              }}
            >
              Connexion
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                className="field"
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
                className="field"
                margin="normal"
                required
                fullWidth
                label="Mot de Passe"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                type="password"
                error={passwordError !== ""}
                helperText={passwordError}
              />
              <Grid item xs>
                <Link
                  href={`${process.env.BASE_PATH ?? ""}/reset-password`}
                  variant="body2"
                >
                  Mot de Passe Oublié ?
                </Link>
              </Grid>
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
          {errorOccurred && (
        <CustomizedSnackbars
          open={errorOccurred}
          severity="error"
          message={errorMessage}
          onClose={() => setErrorOccurred(false)}
        />
      )}
        </Container>
      </div>
    </>
  );
};

export default LoginPage;
