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
import { toast } from "react-toastify";

const LoginPage = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (event) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPasswordValid(credentials.password)) {
      setPasswordError(
        "Le mot de passe n'est pas conforme"
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      await AuthAPI.authenticate(credentials);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      toast.error("Les informations de connexion ne sont pas correct");
    }
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return passwordRegex.test(password);
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
            <Avatar sx={{ m: 1}}>
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
                <Link href={`${process.env.BASE_PATH ?? ""}/reset-password`} variant="body2">
                  Forgot password?
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
        </Container>
      </div>
    </>
  );
};

export default LoginPage;
