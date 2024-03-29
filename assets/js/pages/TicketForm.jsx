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
import ticketAPI from "../services/ticketAPI";
import { format } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { fr } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from "react-router-dom";
import NotificationAPI from "../services/NotificationAPI";

const TicketForm = (props, setTickets) => {
  const {
    isAdmin,
    setIsAuthenticated,
    isAuthenticated,
    decodedToken,
    etats,
    apps,
  } = useAuth();

  const initialState = {
    app: "",
    description: "",
    etat: `/api/etats/1` ,
    userId: `/api/users/${decodedToken?.custom_data?.UserId}`,
    dateStart: undefined
  };
  const [ticketData, setTicketData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (props.ticket) {
      setIsEditing(true);
    }
  }, [props.ticket]);

  const fetchTicketsId = async () => {
    try {
      setTicketData({
        app: props.ticket.app["@id"],
        description: props.ticket.description,
        etat: props.ticket.etat["@id"],
        userId: props.ticket.userId["@id"],
        dateStart : props.ticket.dateStart,
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchTicketsId();
  }, [isEditing]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await ticketAPI.update(props.ticket.id, ticketData);
        setTicketData(initialState);
        props.onClose();
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    } else {
      try {
        await ticketAPI.create(ticketData);
        await NotificationAPI.create({name : "Notification", users : ticketData.appUsers })
        setTicketData(initialState);
        props.onClose();
      } catch (error) {
        console.error("Error creating ticket:", error);
      }
    }
  };

  const handleAppChange = (e) => {
    const selectedAppId = e.target.value;
    const selectedApp = apps.find((app) => app["@id"] === selectedAppId);

    setTicketData((prevData) => ({
      ...prevData,
      app: selectedAppId,
      appUsers: selectedApp.users.map((user) => user["@id"]),
    }));
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
             {isEditing ? "Modification du Ticket" : "Création d'un Ticket"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Application</InputLabel>
                    <Select
                      value={ticketData.app}
                      name="app"
                      onChange={handleAppChange}
                      id="app"
                      defaultValue={""}
                    >
                      <MenuItem value="">Sélectionnez une application</MenuItem>
                      {apps?.map((app, index) => (
                        <MenuItem key={index} value={app["@id"]}>
                          {app.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={ticketData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                {isEditing && isAdmin &&(<Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>État</InputLabel>
                    <Select
                      fullWidth
                      label="État"
                      name="etat"
                      value={ticketData.etat}
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="">Sélectionnez un état</MenuItem>
                      {etats?.map((etat, index) => (
                        <MenuItem key={index} value={etat["@id"]}>
                          {etat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>)}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    {isEditing ? "Modifier Ticket" : "Créer Ticket"}
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

export default TicketForm;
