import React, { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../styles/homepage.css";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styled from "@mui/system/styled";
import EventsAPI from "../services/EventsAPI";
import AgentsAPI from "../services/AgentsAPI";
import { format } from "date-fns";
const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  borderRadius: "4px",
  textAlign: "center",
}));

const etablissements = [
  { label: "DI" },
  { label: "Maison Arrêt" },
  { label: "Maison Centrale" },
  { label: "Centres pénitentiaires" },
  { label: "Centres de détention" },
  { label: "Centres de semi-liberté" },
  { label: "EPM" },
];

const conges = [
  { label: "Congés Annuel" },
  { label: "Congé Maladie" },
  { label: "Congés Exceptionnel" },
  { label: "Récupération Heures Supplémentaires" },
  { label: "Temps Partiel" },
];

const PlanningPage = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [updateSelectedDate, setUpdateSelectedDate] = useState();
  const [events, setevents] = useState([]);
  const [agents, setagents] = useState([]);
  const [eventInfo, setEventInfo] = useState([]);
  const [visibleBouton, setVisibleBouton] = useState(false);
  const [valeurSelectionnee, setValeurSelectionnee] = useState("");

  useEffect(() => {
    fetchEvents();
    fetchAgents();
    setUpdateSelectedDate(format(selectedDate, "dd/MM/yyyy"));
  }, []);

  const handleDateChange = (date) => {
    setUpdateSelectedDate(format(date.$d, "dd/MM/yyyy"));
  };

  const fetchEvents = async () => {
    try {
      const data = await EventsAPI.findAll();
      setevents(data);
    } catch (error) {
      toast.error("Les events n'ont pas été chargés");
    }
  };

  const [mission, setMission] = useState({
    etablissement: "",
    autreEtablissement: "",
    objetMission: "",
    Quantification: "",
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setMission({ ...mission, [name]: value });
  };

  const fetchAgents = async () => {
    try {
      const data = await AgentsAPI.findAll();
      setagents(data);
    } catch (error) {
      toast.error("Les agents n'ont pas été chargés");
    }
  };

  const handleSaveMission = () => {
    console.log(mission);
  };

  const handleSaveReunion = async (event) => {};

  const handleSaveCongé = async (event) => {};

  const agentsByService = {};

  agents.forEach((agent) => {
    if (!agentsByService[agent.service]) {
      agentsByService[agent.service] = [];
    }
    agentsByService[agent.service].push(agent);
  });

  const toggleBouton = (agentID, Date) => {
    setVisibleBouton(true);
    setEventInfo([agentID, Date]);
  };


  const disableBouton = () => {
    setVisibleBouton(false);
  };

  function createAccordionItem(title, contacts) {
    return (
      <Accordion key={title}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${title.toLowerCase()}-content`}
          id={`panel-${title.toLowerCase()}-header`}
        >
          <Typography sx={{ textAlign: "left" }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {contacts.map((contact, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginBottom: "8px",
              }}
            >
              <div style={{ flex: 1 }}>
                <Typography sx={{ textAlign: "left" }}>
                  {contact.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textAlign: "left" }}
                >
                  {contact.phone}
                </Typography>
              </div>
              <div>
                {contact.buttons.map((button, btnIndex) => (
                  <Button
                    key={btnIndex}
                    date=""
                    variant="contained"
                    color={button.color}
                    onClick={button.onClick}
                    style={{ marginLeft: "8px" }}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }

  const updatedInfo = Object.entries(agentsByService).map(
    ([service, serviceAgents]) => ({
      title: service,
      contacts: serviceAgents.map((agent) => {
        const filteredEvents = events.filter((event) => {
          const agentId = event.agent.split("/").pop();
          const dateString = event.date;
          const date = new Date(dateString);
          const update = format(date, "dd/MM/yyyy");
          return (
            parseInt(agentId, 10) === agent.id && update === updateSelectedDate
          );
        });

        let buttons = [];

        if (filteredEvents.length === 0) {
          buttons = [
            {
              label: "+",
              color: "primary",
              onClick: () => toggleBouton(agent.id, updateSelectedDate),
            },
            {
              label: "+",
              color: "primary",
              onClick: () => toggleBouton(agent.id, updateSelectedDate),
            },
          ];
        } else {
          buttons = filteredEvents.map((event) => ({
            label:
              event.label.toUpperCase() === "ABS"
                ? event.label
                : event.label.toUpperCase() === "DI"
                ? event.label
                : event.label.toUpperCase() === "MI"
                ? event.label
                : "+",
            color:
              event.label.toUpperCase() === "ABS"
                ? "success"
                : event.label.toUpperCase() === "DI"
                ? "warning"
                : event.label.toUpperCase() === "MI"
                ? "info"
                : "primary",
            onClick: disableBouton,
          }));

          if (filteredEvents.length === 1) {
            buttons.push({
              label: "+",
              color: "primary",
              onClick: () => toggleBouton(agent.id, updateSelectedDate),
            });
          }
        }

        return {
          name: `${agent.prenom} ${agent.nom}`,
          buttons: buttons,
          phone: agent.telephone.replace(/(\d{2})(?=\d)/g, "$1 "),
        };
      }),
    })
  );

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;

    setMission((prevMission) => ({
      ...prevMission,
      etablissement: selectedValue,
    }));

    setValeurSelectionnee(selectedValue);
  };


  return (
    <>
      <div className="calandar">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            className="calendar-container"
            date={selectedDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </div>
      <div>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          pb={2}
        >
          <Grid item xs={6}>
            <Item className="EDT">
              {updatedInfo.map((item) =>
                createAccordionItem(item.title, item.contacts)
              )}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item className="Mission">
              <Typography sx={{ p: 2 }}>Mission</Typography>
              <Box>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Etablissement</InputLabel>
                  <Select
                    value={valeurSelectionnee}
                    name="etablissement"
                    onChange={handleSelectionChange}
                  >
                    <MenuItem value="">Sélectionnez un établissement</MenuItem>
                    {etablissements.map((etablissement, index) => (
                      <MenuItem key={index} value={etablissement.label}>
                        {etablissement.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Autre Etablissement"
                  name="autreEtablissement"
                  value={mission.autreEtablissement}
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                />
                <TextField
                  label="Objet de la mission"
                  fullWidth
                  value={mission.objetMission}
                  name="objetMission"
                  margin="normal"
                  onChange={handleChange}
                />
                <TextField
                  label="Objectif et Quantification de travail"
                  fullWidth
                  value={mission.Quantification}
                  name="Quantification"
                  multiline
                  rows={4}
                  margin="normal"
                  onChange={handleChange}
                />
                {visibleBouton && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveMission}
                  >
                    Enregistrer
                  </Button>
                )}
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Item className="Reunion">
              <Typography sx={{ p: 2 }}>Réunion</Typography>
              <Box>
                <Autocomplete
                  options={etablissements}
                  renderInput={(params) => (
                    <TextField {...params} label="Etablissement" />
                  )}
                />
                <TextField
                  label="Autre Etablissement"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Objet de la Réunion"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Ordre du jour"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
                {visibleBouton && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveReunion}
                  >
                    Enregistrer
                  </Button>
                )}
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item className="Conge">
              <Typography sx={{ p: 2 }}>Congés</Typography>
              <Box>
                <Autocomplete
                  options={conges}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Justification"
                      margin="normal"
                    />
                  )}
                />
                {visibleBouton && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveCongé}
                  >
                    Enregistrer
                  </Button>
                )}
              </Box>
            </Item>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default PlanningPage;
