import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useContext,
} from "react";
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
import { fr } from "date-fns/locale";
import ServiceAPI from "../services/ServiceAPI";
import ColorModeContext from "../services/ColorModeContext";

function CustomEditor({
  props,
  selectedOption,
  setSelectedOption,
  setIsLoading,
}) {
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
      <CardContent style={{ overflowY: "auto" }}>
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
            state={props.state}
          />
        )}
        {selectedOption === "REUNION" && (
          <EventForm
            type={"REUNION"}
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
            state={props.state}
          />
        )}
        {selectedOption === "ABSENCE" && (
          <EventForm
            type={"ABSENCE"}
            props={props}
            setIsLoading={setIsLoading}
            edited={props.edited}
            state={props.state}
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
  const [activeService, setActiveService] = useState(null);
  const [services, setServices] = useState(undefined);
  const [allPressed, setAllPressed] = useState(true);

  const { decodedToken } = useAuth();

  const [events, setEvents] = useState([]);

  const [agents, setAgents] = useState([]);

  const colorMode = useContext(ColorModeContext);
  const currentMode = colorMode.mode;

  const deleteOldEvents = async () => {
    try {
      const currentDate = new Date();
      const sevenDaysAgo = addDays(currentDate, -7);

      const eventsToDelete = events.filter((event) => {
        const eventDate = new Date(event.date_fin);
        return eventDate < sevenDaysAgo;
      });

      if (eventsToDelete.length > 0) {
        for (const eventToDelete of eventsToDelete) {
          await handleDeleteEvent(eventToDelete.id);
        }
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression des événements obsolètes.",
        error
      );
    }
  };

  const fetchData = async () => {
    try {
      const [eventsData, agentsData, servicesData] = await Promise.all([
        EventsAPI.findAll(),
        AgentsAPI.findAll(),
        ServiceAPI.findAll(),
      ]);

      setEvents(eventsData);
      setAgents(
        agentsData.map((agent) => ({
          admin_id: agent.id,
          title: `${agent.nom} ${agent.prenom}`,
          mobile: agent.telephone,
          avatar: undefined,
          color: agent.color,
          service: agent.service,
          user: agent.user,
        }))
      );
      setServices(
        servicesData
          .filter((service) => service.agents.length)
          .map((service) => service.name)
      );

      setIsLoading(false);
    } catch (error) {
      toast.error("Les données n'ont pas été chargées");
    }
  };

  useEffect(() => {
    const fetchDataAndDeleteOldEvents = async () => {
      if (isLoading) {
        await deleteOldEvents();
        fetchData();
      }
    };

    fetchDataAndDeleteOldEvents();
  }, [isLoading]);

  useEffect(() => {
    let selectedService;
    if (localStorage.getItem("selectedService")) {
      selectedService = localStorage.getItem("selectedService");
    } else {
      if (decodedToken?.custom_data?.service) {
        selectedService = decodedToken?.custom_data?.service;
        localStorage.setItem("selectedService", selectedService);
      } else {
        selectedService = "ALL";
        localStorage.setItem("selectedService", selectedService);
      }
    }

    if (services) {
      if (services.includes(selectedService)) {
        handleServiceChangeForAll(selectedService);
      } else {
        handleServiceChange();
      }
    }

    if (localStorage.getItem("selectedViewMode")) {
      const storedViewMode = localStorage.getItem("selectedViewMode");
      if (storedViewMode === "tabs") {
        setMode("tabs");
        calendarRef.current?.scheduler?.handleState("tabs", "resourceViewMode");
      } else {
        setMode("default");
        calendarRef.current?.scheduler?.handleState(
          "default",
          "resourceViewMode"
        );
      }
    }
  }, [services]);

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
        (agent) => agent.service.name === selectedService
      );
    }

    if (decodedToken?.custom_data?.service === selectedService) {
      setIsEditable(true);
      setIsDeletable(true);
    } else {
      setIsEditable(false);
      setIsDeletable(false);
    }

    setAllPressed(false);
    setActiveService(selectedService);

    localStorage.setItem("selectedService", selectedService);

    calendarRef.current?.scheduler?.handleState(filteredResources, "resources");
  };

  const handleServiceChange = () => {
    setIsEditable(false);
    setIsDeletable(false);
    setAllPressed(true);
    setActiveService(null);
    localStorage.setItem("selectedService", "ALL");

    calendarRef.current?.scheduler?.handleState(agents, "resources");
  };

  useEffect(() => {
    calendarRef.current?.scheduler?.handleState(isEditable, "editable");
    calendarRef.current?.scheduler?.handleState(isDeletable, "deletable");
  }, [isEditable, isDeletable]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Fragment>
      <div style={{ textAlign: "center", paddingTop: 60 }}>
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
            localStorage.setItem("selectedViewMode", "default");
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
            localStorage.setItem("selectedViewMode", "tabs");
          }}
        >
          Personne
        </Button>
      </div>
      <div style={{ margin: "10px" }} className="service">
        <span>Changer le service : </span>
        <Button
          variant={allPressed ? "contained" : "outlined"}
          style={{ marginRight: "10px" }}
          onClick={() => handleServiceChange()}
        >
          ALL
        </Button>
        {services.map((service, index) => (
          <Button
            key={service}
            variant={activeService === service ? "contained" : "outlined"}
            style={{ marginRight: "10px" }}
            onClick={() => handleServiceChangeForAll(service)}
          >
            {service}
          </Button>
        ))}
      </div>
      <div style={{ paddingBottom: "50px" }} className="calendar">
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
          month={{
            weekDays: [2, 3, 4, 5, 6],
          }}
          day={{
            weekDays: [2, 3, 4, 5, 6],
            startHour: 7,
            endHour: 19,
            step: 60,
          }}
          locale={fr}
          hourFormat="24"
          events={events.map((event) => ({
            event_id: event.id,
            title: event.label,
            start: new Date(event.date_debut),
            end: new Date(event.date_fin),
            admin_id: event.agent.id,
            color:
              event.label === "MISSION"
                ? "#d32f2f"
                : event.label === "REUNION"
                ? "orange"
                : event.label === "ABSENCE"
                ? "green"
                : "defaultColor",
            justificatif: event.justificatif,
            etablissement: event.etablissement,
            autreEtablissement: event.autreEtablissement,
            objetReunion: event.objetReunion,
            ordreJour: event.ordreJour,
            objetMission: event.objetMission,
            quantification: event.Quantification,
          }))}
          resources={agents}
          draggable={false}
          week={{
            weekDays: [2, 3, 4, 5, 6],
            startHour: 7,
            endHour: 19,
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
              <Card sx={{ width: "750px", overflowX: "auto" }}>
                <CardContent style={{ overflowX: "auto" }}>
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
                      state={props.state}
                    />
                  ) : selectedOption === "REUNION" ? (
                    <EventForm
                      type={"REUNION"}
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                      state={props.state}
                    />
                  ) : selectedOption === "ABSENCE" ? (
                    <EventForm
                      type={"ABSENCE"}
                      props={props}
                      setIsLoading={setIsLoading}
                      edited={props.edited}
                      state={props.state}
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
                    {event?.etablissement?.name && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {event?.etablissement?.name}
                      </Typography>
                    )}
                    {event.autreEtablissement &&
                      !event?.etablissement?.name && (
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
                    {event?.etablissement?.name && (
                      <Typography variant="body1">
                        <strong>Etablissement:</strong>{" "}
                        {event?.etablissement?.name}
                      </Typography>
                    )}
                    {event.autreEtablissement &&
                      !event?.etablissement?.name && (
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
                      <strong>Justification:</strong>{" "}
                      {event?.justificatif?.name}
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
