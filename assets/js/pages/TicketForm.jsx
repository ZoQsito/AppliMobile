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

const TicketForm = (props) => {
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
    dateStart: "",
    dateEnd: undefined ,
    etat: `/api/etats/1` ,
    userId: `/api/users/${decodedToken?.custom_data?.UserId}`,
  };
  const [ticketData, setTicketData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();


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
        dateStart: props.ticket.dateStart,
        dateEnd: props.ticket.dateEnd,
        etat: props.ticket.etat["@id"],
        userId: props.ticket.userId["@id"],
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
        setTicketData(initialState);
        navigate("/ticket");
      } catch (error) {
        console.error("Error creating ticket:", error);
      }
    }
  };

  const handleDateChange = (newDate) => {
    setTicketData((prevData) => ({
      ...prevData,
      dateStart: format(new Date(newDate), "yyyy-MM-dd"),
    }));
  };

  if (apps === undefined || etats === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      ></Box>
    );
  }

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
              Création d'un Ticket
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Application</InputLabel>
                    <Select
                      value={ticketData.app}
                      name="app"
                      onChange={handleInputChange}
                      id="app"
                      defaultValue={""}
                    >
                      <MenuItem value="">Sélectionnez une application</MenuItem>
                      {apps.map((app, index) => (
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
                <Grid item xs={12} md={6}  style={{marginTop : "18px"}}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={fr}
                  >
                    <DatePicker
                      value={new Date(ticketData.dateStart)}
                      label="Date de Début"
                      onChange={(newDate) => handleDateChange(newDate)}
                    />
                  </LocalizationProvider>
                </Grid>
                {isEditing &&(<Grid item xs={12} md={6}>
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
                      {etats.map((etat, index) => (
                        <MenuItem key={index} value={etat["@id"]}>
                          {etat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>)}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Créer Ticket
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
