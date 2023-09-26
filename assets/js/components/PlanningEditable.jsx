// PlanningEdit.js
import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import AgentsAPI from "../services/AgentsAPI";
import EventsAPI from "../services/EventsAPI";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EventFormMI, EventFormREU, EventFormABS } from "./EventForm";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CustomEditor({
  props,
  selectedOption,
  setSelectedOption,
  setIsLoading,
}) {
  console.log(props);

  useEffect(() => {
    switch (props.edited.title) {
      case "MI":
        setSelectedOption("MISSION");
        break;
      case "REU":
        setSelectedOption("REUNION");
        break;
      case "ABS":
        setSelectedOption("ABSENCE");
        break;
      default:
        setSelectedOption("");
    }
  }, []);

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
  };

  return (
    <Card sx={{ width: "750px" }}>
      <CardContent>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {props.edited ? "Modification d'événement" : "Ajout d'événement"}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => props.close()}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container rowSpacing={1}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Choisissez une option</InputLabel>
              <Select value={selectedOption} onChange={handleOptionChange}>
                <MenuItem value="">Sélectionnez une option</MenuItem>
                <MenuItem value="MISSION">MISSION</MenuItem>
                <MenuItem value="REUNION">REUNION</MenuItem>
                <MenuItem value="ABSENCE">ABSENCE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {selectedOption === "MISSION" && (
          <EventFormMI
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
          />
        )}
        {selectedOption === "REUNION" && (
          <EventFormREU
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
          />
        )}
        {selectedOption === "ABSENCE" && (
          <EventFormABS
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
          />
        )}
      </CardContent>
    </Card>
  );
}

const PlanningEditable = ({ props }) => {
  const [mode, setMode] = useState("default");
  const calendarRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [events, setEvents] = useState([
    {
      event_id: "",
      title: "",
      start: "",
      end: "",
      admin_id: "",
    },
  ]);
  const [agents, setAgents] = useState([
    {
      admin_id: "",
      title: "",
      mobile: "",
      avatar: "",
      color: "",
    },
  ]);

  const fetchData = async () => {
    try {
      const eventsData = await EventsAPI.findAll();
      const agentsData = await AgentsAPI.findAll();

      setEvents(eventsData);

      setAgents(
        agentsData.map((agent) => ({
          admin_id: agent.id,
          title: `${agent.nom} ${agent.prenom}`,
          mobile: agent.telephone,
          avatar: "https://picsum.photos/200/300",
          color: agent.color,
        }))
      );

      setIsLoading(false);
    } catch (error) {
      toast.error("Les données n'ont pas été chargées");
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoading]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDeleteEvent = async (props) => {
    console.log(props);
    try {
      await EventsAPI.delete(props);
      setIsLoading(true);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de l'événement.",
        error
      );
    }
  };

  console.log(isEditorOpen)

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        <span>Resource View Mode: </span>
        <Button
          color={mode === "default" ? "primary" : "inherit"}
          variant={mode === "default" ? "contained" : "text"}
          size="small"
          onClick={() => {
            setMode("default");
            calendarRef.current?.scheduler?.handleState(
              "default",
              "resourceViewMode"
            );
          }}
        >
          Default
        </Button>
        <Button
          color={mode === "tabs" ? "primary" : "inherit"}
          variant={mode === "tabs" ? "contained" : "text"}
          size="small"
          onClick={() => {
            setMode("tabs");
            calendarRef.current?.scheduler?.handleState(
              "tabs",
              "resourceViewMode"
            );
          }}
        >
          Tabs
        </Button>
      </div>
      <Scheduler
        ref={calendarRef}
        events={events.map((event) => ({
          event_id: event.id,
          title: event.label,
          start: new Date(event.dateDebut),
          end: new Date(event.dateFin),
          admin_id: parseInt(event.agent.split("/").pop(), 10),
          color:
            event.label === "MI"
              ? "red"
              : event.label === "REU"
              ? "yellow"
              : event.label === "ABS"
              ? "green"
              : "defaultColor",
          justification: event.justification,
          etablissement: event.etablissement,
          autreEtablissement: event.autreEtablissement,
          objetReunion: event.objetReunion,
          ordreJour: event.ordreJour,
          objetMission: event.objetMission,
          quantification: event.quantification,
        }))}
        resources={agents}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 6,
          startHour: 8,
          endHour: 18,
          step: 60,
        }}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          subTextField: "mobile",
          avatarField: "title",
          colorField: "color",
        }}
        onDelete={(props) => handleDeleteEvent(props)}
        customViewer={(props) => {
          const eventAgent = agents.find(
            (agent) => agent.admin_id === props.admin_id
          );
          return (
            <Card sx={{ width: "350px" }}>
              <CardContent>
                <Typography id="modal-modal-title" variant="h6">
                  {eventAgent ? eventAgent.title : "Nom de la personne inconnu"}
                </Typography>
                {props.title === "MI" && (
                  <div>
                    <Typography variant="h6">Mission</Typography>
                    {props.etablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {props.etablissement}
                      </Typography>
                    )}
                    {props.autreEtablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {props.autreEtablissement}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Objet de la Mission:</strong> {props.objetMission}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Quantification:</strong> {props.quantification}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Debut:</strong>{" "}
                      {new Date(props.start).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Fin:</strong>{" "}
                      {new Date(props.end).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteEvent(props.event_id)}
                      style={{ marginTop: "16px" }}
                    >
                      Supprimer
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setIsEditorOpen(true)}
                      style={{ marginTop: "16px" }}
                    >
                      Modifier
                    </Button>
                  </div>
                )}
                {props.title === "REU" && (
                  <div>
                    <Typography variant="h6">Réunion</Typography>
                    {props.etablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {props.etablissement}
                      </Typography>
                    )}
                    {props.autreEtablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {props.autreEtablissement}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Objet de la Réunion:</strong> {props.objetReunion}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ordre du Jour:</strong> {props.ordreJour}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Debut:</strong>{" "}
                      {new Date(props.start).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Fin:</strong>{" "}
                      {new Date(props.end).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteEvent(props.event_id)}
                      style={{ marginTop: "16px" }}
                    >
                      Supprimer
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setIsEditorOpen(true)}
                      style={{ marginTop: "16px" }}
                    >
                      Modifier
                    </Button>
                  </div>
                )}
                {props.title === "ABS" && (
                  <div>
                    <Typography variant="h6">Absence</Typography>
                    <Typography variant="body1">
                      <strong>Justification:</strong> {props.justification}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Debut:</strong>{" "}
                      {new Date(props.start).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Fin:</strong>{" "}
                      {new Date(props.end).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteEvent(props.event_id)}
                      style={{ marginTop: "16px" }}
                    >
                      Supprimer
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setIsEditorOpen(true)}
                      style={{ marginTop: "16px" }}
                    >
                      Modifier
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        }}
        customEditor={(props) => (
            props.edited === undefined ? (
              <Card sx={{ width: "750px" }}>
                <CardContent>
                  <AppBar position="static">
                    <Toolbar>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Ajout d'événement
                      </Typography>
                      <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => props.close()}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                  <Grid container rowSpacing={1}>
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Choisissez une option</InputLabel>
                        <Select
                          value={selectedOption}
                          onChange={handleOptionChange}
                        >
                          <MenuItem value="">Sélectionnez une option</MenuItem>
                          <MenuItem value="MI">MI</MenuItem>
                          <MenuItem value="REU">REU</MenuItem>
                          <MenuItem value="ABS">ABS</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {selectedOption === "MI" && (
                    <EventFormMI
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                    />
                  )}
                  {selectedOption === "REU" && (
                    <EventFormREU
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                    />
                  )}
                  {selectedOption === "ABS" && (
                    <EventFormABS
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                    />
                  )}
                </CardContent>
              </Card>
            ) : (
              <CustomEditor
                props={props}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                setIsLoading={setIsLoading}
              />
            )
        )}
      />
    </Fragment>
  );
};

export default PlanningEditable;
