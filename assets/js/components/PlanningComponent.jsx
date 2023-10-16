import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  AppBar,
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
import EventForm from "./EventForm";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { addDays } from "date-fns";

function CustomEditor({
  props,
  selectedOption,
  setSelectedOption,
  setIsLoading,
}) {
  console.log(props);

  useEffect(() => {
    switch (props.edited.title) {
      case "MISSION":
        setSelectedOption("MISSION");
        break;
      case "REUNION":
        setSelectedOption("REUNION");
        break;
      case "ABSENCE":
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
          <EventForm
            type={"MISSION"}
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
          />
        )}
        {selectedOption === "REUNION" && (
          <EventForm
            type={"REUNION"}
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
          />
        )}
        {selectedOption === "ABSENCE" && (
          <EventForm
            type={"ABSENCE"}
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
          />
        )}
      </CardContent>
    </Card>
  );
}

const PlanningComponent = ({ props }) => {
  const [mode, setMode] = useState("default");
  const calendarRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);

  const { isAdmin, setIsAuthenticated, isAuthenticated, isRESP, decodedToken } =
    useAuth();

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
      service: "",
      user: "",
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
          service: agent.service,
          user: agent.user,
        }))
      );

      setIsLoading(false);
    } catch (error) {
      toast.error("Les données n'ont pas été chargées");
    }
  };

  // const deleteOldEvents = async () => {
  //   try {
  //     const eventsData = await EventsAPI.findAll();
  //     const currentDate = new Date();
  //     const sevenDaysAgo = addDays(currentDate, -7);

  //     const eventsToDelete = eventsData.filter((event) => {
  //       const eventDate = new Date(event.dateFin);
  //       return eventDate < sevenDaysAgo;
  //     });

  //     for (const eventToDelete of eventsToDelete) {
  //       await handleDeleteEvent(eventToDelete.id);
  //     }

  //     fetchData();
  //   } catch (error) {
  //     console.error(
  //       "Une erreur s'est produite lors de la suppression des événements obsolètes.",
  //       error
  //     );
  //   }
  // };

  useEffect(() => {
    if (isLoading) {
      fetchData();
    }
  }, [isLoading]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDeleteEvent = async (props) => {
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

  const handleServiceChangeForAll = (selectedService) => {
    let filteredResources = agents;

    if (selectedService) {
      filteredResources = agents.filter(
        (agent) => agent.service === selectedService
      );
    }

    if (decodedToken?.custom_data?.service === selectedService) {
      setIsEditable(true);
      setIsDeletable(true);
    } else {
      setIsEditable(false);
      setIsDeletable(false);
    }

    calendarRef.current?.scheduler?.handleState(filteredResources, "resources");
  };

  const handleServiceChange = () => {
    setIsEditable(false);
    setIsDeletable(false);

    calendarRef.current?.scheduler?.handleState(agents, "resources");
  };

  useEffect(() => {
    calendarRef.current?.scheduler?.handleState(isEditable, "editable");
    calendarRef.current?.scheduler?.handleState(isDeletable, "deletable");
  }, [isEditable, isDeletable]);

  const agentsByService = {};

  agents.forEach((agent) => {
    if (!agentsByService[agent.service]) {
      agentsByService[agent.service] = [];
    }
    agentsByService[agent.service].push(agent);
  });

  const services = Object.keys(agentsByService);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        <Button
          color={mode === "default" ? "primary" : "inherit"}
          variant={mode === "default" ? "contained" : "text"}
          size="medium"
          style={{ marginRight: "10px" }}
          onClick={() => {
            setMode("default");
            calendarRef.current?.scheduler?.handleState(
              "default",
              "resourceViewMode"
            );
          }}
        >
          Général
        </Button>
        <Button
          color={mode === "tabs" ? "primary" : "inherit"}
          variant={mode === "tabs" ? "contained" : "text"}
          size="medium"
          onClick={() => {
            setMode("tabs");
            calendarRef.current?.scheduler?.handleState(
              "tabs",
              "resourceViewMode"
            );
          }}
        >
          Personne
        </Button>
      </div>
      <div style={{ margin: "10px 0" }}>
        <span>Changer le service : </span>
        <Button
          variant="outlined"
          style={{ marginRight: "10px" }}
          onClick={() => handleServiceChange()}
        >
          ALL
        </Button>
        {services.map((service, index) => (
          <Button
            key={service}
            variant="outlined"
            style={{ marginRight: "10px" }}
            onClick={() => handleServiceChangeForAll(service)}
          >
            {service}
          </Button>
        ))}
      </div>
      <div style={{ marginBottom: "100px" }}>
        <Scheduler
          ref={calendarRef}
          translations={{
            navigation: {
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              today: "Aujourd'hui",
            },
          }}
          events={events.map((event) => ({
            event_id: event.id,
            title: event.label,
            start: new Date(event.date_debut),
            end: new Date(event.date_fin),
            admin_id: event.agent.id,
            color:
              event.label === "MISSION"
                ? "red"
                : event.label === "REUNION"
                ? "yellow"
                : event.label === "ABSENCE"
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
          customEditor={(props) =>
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
                          <MenuItem value="MISSION">MISSION</MenuItem>
                          <MenuItem value="REUNION">REUNION</MenuItem>
                          <MenuItem value="ABSENCE">ABSENCE</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {selectedOption === "MISSION" ? (
                    <EventForm
                    type={"MISSION"}
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                    />
                  ) : selectedOption === "REUNION" ? (
                    <EventForm
                    type={"REUNION"}
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                    />
                  ) : selectedOption === "ABSENCE" ? (
                    <EventForm
                    type={"ABSENCE"}
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                    />
                  ) : null}
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
          }
          viewerExtraComponent={(props, event) => {
            const eventAgent = agents.find(
              (agent) => agent.admin_id === event.admin_id
            );
            return (
              <div>
                <Typography id="modal-modal-title" variant="h6">
                  {eventAgent ? eventAgent.title : "Nom de la personne inconnu"}
                </Typography>
                {event.title === "MISSION" && (
                  <div>
                    <Typography variant="h6">Mission</Typography>
                    {event.etablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong> {event.etablissement}
                      </Typography>
                    )}
                    {event.autreEtablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {event.autreEtablissement}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Objet de la Mission:</strong> {event.objetMission}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Quantification:</strong> {event.quantification}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Debut:</strong>{" "}
                      {new Date(event.start).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Fin:</strong>{" "}
                      {new Date(event.end).toLocaleDateString("fr-FR")}
                    </Typography>
                  </div>
                )}
                {event.title === "REUNION" && (
                  <div>
                    <Typography variant="h6">Réunion</Typography>
                    {event.etablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong> {event.etablissement}
                      </Typography>
                    )}
                    {event.autreEtablissement && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {event.autreEtablissement}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <strong>Objet de la Réunion:</strong> {event.objetReunion}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ordre du Jour:</strong> {event.ordreJour}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Debut:</strong>{" "}
                      {new Date(event.start).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Fin:</strong>{" "}
                      {new Date(event.end).toLocaleDateString("fr-FR")}
                    </Typography>
                  </div>
                )}
                {event.title === "ABSENCE" && (
                  <div>
                    <Typography variant="h6">Absence</Typography>
                    <Typography variant="body1">
                      <strong>Justification:</strong> {event.justification}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Debut:</strong>{" "}
                      {new Date(event.start).toLocaleDateString("fr-FR")}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date Fin:</strong>{" "}
                      {new Date(event.end).toLocaleDateString("fr-FR")}
                    </Typography>
                  </div>
                )}
              </div>
            );
          }}
          editable={isEditable}
          deletable={isDeletable}
        />
      </div>
    </Fragment>
  );
};

export default PlanningComponent;
