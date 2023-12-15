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
  Checkbox,
  Chip,
  ListItemText,
} from "@mui/material";
import ApplicationAPI from "../services/ApplicationAPI";
import usersAPI from "../services/usersAPI";

const AppForm = (props) => {
  const initialState = {
    name: "",
    lien: "",
    users: "",
  };
  const [appData, setAppData] = useState(initialState);
  const [users, setUsers] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (props.app) {
      setIsEditing(true);
    }
  }, [props.app]);

  const fetchUser = async () => {
    try {
      const users = await usersAPI.findAll();
      const filteredUsers = users.filter(
        (user) => user.role.name === "ROLE_ADMIN"
      );
      setUsers(filteredUsers);

      if (isEditing) {
        const appUserIds = props.app.users.map((user) => user["@id"]);
        setSelectedUsers(
          filteredUsers.filter((user) => appUserIds.includes(user["@id"]))
        );
      }
    } catch (error) {}
  };

  const fetchAppId = async () => {
    try {
      setAppData({
        name: props.app.name,
        lien: props.app.lien,
        users: props.app.users.map((user) => user["@id"]),
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchAppId();
  }, [isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await ApplicationAPI.updatePatch(props.app.id, {
          ...appData,
          users: selectedUsers.map((user) => user["@id"]),
        });
        setAppData(initialState);
        props.onClose();
      } catch (error) {
        console.error("Error updating app:", error);
      }
    } else {
      try {
        await ApplicationAPI.create({
          ...appData,
          users: selectedUsers.map((user) => user["@id"]),
        });
        setAppData(initialState);
        props.onClose();
      } catch (error) {
        console.error("Error creating app:", error);
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
              {isEditing
                ? "Modification de l'Application"
                : "Ajout d'une Application"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    rows={4}
                    label="Nom de L'application"
                    name="name"
                    value={appData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    rows={4}
                    label="Lien"
                    name="lien"
                    value={appData.lien}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>ADMIN Associé</InputLabel>
                    <Select
                      multiple
                      value={selectedUsers}
                      onChange={(e) => {
                        setSelectedUsers(e.target.value);
                      }}
                      renderValue={(selected) => (
                        <div>
                          {selectedUsers?.map((user) => (
                            <Chip key={user.id} label={user.username} />
                          ))}
                        </div>
                      )}
                    >
                      {users?.map((user) => (
                        <MenuItem key={user.id} value={user}>
                          <Checkbox
                            checked={selectedUsers?.some(
                              (selectedUser) => selectedUser.id === user.id
                            )}
                          />
                          <ListItemText primary={user.username} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    {isEditing ? "Modifier Application" : "Ajouté Application"}
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

export default AppForm;
