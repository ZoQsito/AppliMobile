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
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "2px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  borderRadius: "4px",
  textAlign: "center",
}));

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
  { label: "Congé Annuel" },
  { label: "Congé Maladie" },
  { label: "Congé Exceptionnel" },
  { label: "Récupération Heures Supplémentaires" },
  { label: "Temps Partiel" },
];

const PlanningPage = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [updateDate, setUpdateDate] = useState();
  const [events, setevents] = useState([]);
  const [eventInfo, setEventInfo] = useState([]);
  const [agents, setagents] = useState([]);
  const [visibleBouton, setVisibleBouton] = useState(false);
  const [valeurSelectionnee, setValeurSelectionnee] = useState("");
  const [justificatifSelectionnee, setJustificatifSelectionnee] = useState("");
  const [agentSelectionne, setAgentSelectionne] = useState(null);
  const [typeBoutonSelectionne, setTypeBoutonSelectionne] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchAgents();
    setUpdateDate(format(selectedDate, "yyyy-MM-dd"));
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [visibleBouton]);

  const handleDateChange = (date) => {
    setSelectedDate(date.$d);
    setUpdateDate(format(date.$d, "yyyy-MM-dd"));
  };

  const fetchEvents = async () => {
    try {
      const data = await EventsAPI.findAll();
      setevents(data);
    } catch (error) {
      toast.error("Les events n'ont pas été chargés");
    }
  };

  const clearFields = () => {
    setMission({
      etablissement: "",
      autreEtablissement: "",
      objetMission: "",
      Quantification: "",
      label: "MI",
      date: "",
      agentId: "",
    });

    setReunion({
      etablissement: "",
      autreEtablissement: "",
      objetReunion: "",
      ordreJour: "",
      label: "REU",
      date: "",
      agentId: "",
    });

    setConge({
      justification: "",
      label: "ABS",
    });

    setValeurSelectionnee("");
    setJustificatifSelectionnee("");
    setVisibleBouton(false);
  };

  const [mission, setMission] = useState({
    etablissement: "",
    autreEtablissement: "",
    objetMission: "",
    Quantification: "",
    label: "MI",
    date: "",
    agent: "",
  });

  const [reunion, setReunion] = useState({
    etablissement: "",
    autreEtablissement: "",
    objetReunion: "",
    ordreJour: "",
    label: "REU",
    date: "",
    agent: "",
  });

  const [conge, setConge] = useState({
    justification: "",
    label: "ABS",
    date: "",
    agent: "",
  });

  const handleChangeMI = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setMission({ ...mission, [name]: value });
  };
  const handleChangeRE = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setReunion({ ...reunion, [name]: value });
  };

  const fetchAgents = async () => {
    try {
      const data = await AgentsAPI.findAll();
      setagents(data);
    } catch (error) {
      toast.error("Les agents n'ont pas été chargés");
    }
  };

  const handleSaveMission = async (event) => {
    event.preventDefault();

    await EventsAPI.create(mission);
    clearFields();
  };

  const handleSaveReunion = async (event) => {
    event.preventDefault();

    await EventsAPI.create(reunion);
    clearFields();
  };

  const handleSaveCongé = async (event) => {
    event.preventDefault();

    await EventsAPI.create(conge);
    clearFields();
  };

  const agentsByService = {};

  agents.forEach((agent) => {
    if (!agentsByService[agent.service]) {
      agentsByService[agent.service] = [];
    }
    agentsByService[agent.service].push(agent);
  });

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
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6">
                      {agentSelectionne
                        ? `${agentSelectionne.nom} ${agentSelectionne.prenom}`
                        : ""}
                    </Typography>
                    {typeBoutonSelectionne === "MI" && (
                      <div>
                        <Typography variant="subtitle1">Mission</Typography>
                        <Typography variant="body1">
                          Etablissement: {eventInfo.etablissement}
                        </Typography>
                        <Typography variant="body1">
                          Autre Etablissement: {eventInfo.autreEtablissement}
                        </Typography>
                        <Typography variant="body1">
                          Objet de la Mission: {eventInfo.objetMission}
                        </Typography>
                        <Typography variant="body1">
                          Quantification: {eventInfo.Quantification}
                        </Typography>
                        <Typography variant="body1">
                        {new Date(eventInfo.date).toLocaleDateString('fr-FR')}
                        </Typography>
                      </div>
                    )}
                    {typeBoutonSelectionne === "REU" && (
                      <div>
                        <Typography variant="subtitle1">Réunion</Typography>
                        <Typography variant="body1">
                          Etablissement: {eventInfo.etablissement}
                        </Typography>
                        <Typography variant="body1">
                          Autre Etablissement: {eventInfo.autreEtablissement}
                        </Typography>
                        <Typography variant="body1">
                          Objet de la Réunion: {eventInfo.objetReunion}
                        </Typography>
                        <Typography variant="body1">
                          Ordre du Jour: {eventInfo.ordreJour}
                        </Typography>
                        <Typography variant="body1">
                        {new Date(eventInfo.date).toLocaleDateString('fr-FR')}
                        </Typography>
                      </div>
                    )}
                    {typeBoutonSelectionne === "ABS" && (
                      <div>
                        <Typography variant="subtitle1">Absence</Typography>
                        <Typography variant="body1">
                          Justification: {eventInfo.justification}
                        </Typography>
                        <Typography variant="body1">
                        Date: {new Date(eventInfo.date).toLocaleDateString('fr-FR')}
                        </Typography>
                      </div>
                    )}
                  </Box>
                </Modal>
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
          const update = format(date, "yyyy-MM-dd");
          return parseInt(agentId, 10) === agent.id && update === updateDate;
        });

        let buttons = [];

        if (filteredEvents.length === 0) {
          buttons = [
            {
              label: "+",
              color: "primary",
              onClick: () => toggleBouton(agent.id),
            },
            {
              label: "+",
              color: "primary",
              onClick: () => toggleBouton(agent.id),
            },
          ];
        } else {
          buttons = filteredEvents.map((event) => ({
            label:
              event.label.toUpperCase() === "ABS"
                ? event.label
                : event.label.toUpperCase() === "REU"
                ? event.label
                : event.label.toUpperCase() === "MI"
                ? event.label
                : "+",
            color:
              event.label.toUpperCase() === "ABS"
                ? "success"
                : event.label.toUpperCase() === "REU"
                ? "warning"
                : event.label.toUpperCase() === "MI"
                ? "error"
                : "primary",
            onClick: () => {
              setAgentSelectionne(agent),
                disableBouton(),
                setTypeBoutonSelectionne(event.label),
                setEventInfo(event);
            },
          }));

          if (filteredEvents.length === 1) {
            buttons.push({
              label: "+",
              color: "primary",
              onClick: () => toggleBouton(agent.id),
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

  const toggleBouton = (agentID) => {
    clearFields();
    setVisibleBouton(true);

    setMission((prevMission) => ({
      ...prevMission,
      agent: `/api/agents/${agentID}`,
      date: updateDate,
    }));
    setReunion((prevReunion) => ({
      ...prevReunion,
      agent: `/api/agents/${agentID}`,
      date: updateDate,
    }));
    setConge((prevConge) => ({
      ...prevConge,
      agent: `/api/agents/${agentID}`,
      date: updateDate,
    }));
  };

  const disableBouton = () => {
    clearFields();
    setOpen(true);
  };

  const handleSelectionChangeMI = (event) => {
    const selectedValue = event.target.value;

    setMission((prevMission) => ({
      ...prevMission,
      etablissement: selectedValue,
    }));

    setValeurSelectionnee(selectedValue);
  };

  const handleSelectionChangeRE = (event) => {
    const selectedValue = event.target.value;

    setReunion((prevReunion) => ({
      ...prevReunion,
      etablissement: selectedValue,
    }));

    setValeurSelectionnee(selectedValue);
  };

  const handleSelectionChangeConge = (event) => {
    const justificatif = event.target.value;

    setConge((prevConge) => ({
      ...prevConge,
      justification: justificatif,
    }));

    setJustificatifSelectionnee(justificatif);
  };

  return (
    <>
      <div className="calandar">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            className="calendar-container"
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
                    onChange={handleSelectionChangeMI}
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
                  onChange={handleChangeMI}
                />
                <TextField
                  label="Objet de la mission"
                  fullWidth
                  value={mission.objetMission}
                  name="objetMission"
                  margin="normal"
                  onChange={handleChangeMI}
                />
                <TextField
                  label="Objectif et Quantification de travail"
                  fullWidth
                  value={mission.Quantification}
                  name="Quantification"
                  multiline
                  rows={4}
                  margin="normal"
                  onChange={handleChangeMI}
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
                <FormControl fullWidth margin="normal">
                  <InputLabel>Etablissement</InputLabel>
                  <Select
                    value={valeurSelectionnee}
                    name="etablissement"
                    onChange={handleSelectionChangeRE}
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
                  value={reunion.autreEtablissement}
                  fullWidth
                  margin="normal"
                  onChange={handleChangeRE}
                />
                <TextField
                  label="Objet de la Réunion"
                  fullWidth
                  margin="normal"
                  name="objetReunion"
                  value={reunion.objetReunion}
                  onChange={handleChangeRE}
                />
                <TextField
                  label="Ordre du jour"
                  fullWidth
                  multiline
                  rows={4}
                  name="ordreJour"
                  margin="normal"
                  value={reunion.ordreJour}
                  onChange={handleChangeRE}
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
                <FormControl fullWidth margin="normal">
                  <InputLabel>Justificatif</InputLabel>
                  <Select
                    value={justificatifSelectionnee}
                    name="justificatif"
                    onChange={handleSelectionChangeConge}
                  >
                    <MenuItem value="">Sélectionnez un justificatif</MenuItem>
                    {conges.map((conges, index) => (
                      <MenuItem key={index} value={conges.label}>
                        {conges.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
