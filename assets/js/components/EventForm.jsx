import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EventsAPI from "../services/EventsAPI";
import { format } from "date-fns";
import dayjs from "dayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "2px solid",
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
  { label: "Congé Annuel" },
  { label: "Congé Maladie" },
  { label: "Congé Exceptionnel" },
  { label: "Récupération Heures Supplémentaires" },
  { label: "Temps Partiel" },
];

const EventForm = ({ type, props, setIsLoading, edited }) => {
  console.log(props);

  const [eventData, setEventData] = useState({
    etablissement: "",
    autreEtablissement: "",
    label: type,
    dateDebut: "",
    dateFin: "",
    agent: "",
    objetMission: "",
    quantification: "",
    objetReunion: "",
    ordreJour: "",
    justification: "",
  });

  useEffect(() => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      label: type,
      objetMission: "",
      quantification: "",
      objetReunion: "",
      ordreJour: "",
      justification: "",
    }));
  }, [type]);

  console.log(eventData);

  const isEditMode = !!edited;

  useEffect(() => {
    if (isEditMode) {
      if (type === edited.title) {
        setEventData({
          etablissement: edited.etablissement,
          autreEtablissement: edited.autreEtablissement,
          label: edited.title,
          dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
          agent: `/api/agents/${edited.admin_id}`,
          objetMission: edited.objetMission,
          quantification: edited.quantification,
          objetReunion: edited.objetReunion,
          ordreJour: edited.ordreJour,
          justification: edited.justification,
        });
      } else {
        setEventData({
          etablissement: "",
          autreEtablissement: "",
          label: type,
          dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
          agent: `/api/agents/${edited.admin_id}`,
          objetMission: "",
          quantification: "",
          objetReunion: "",
          ordreJour: "",
          justification: "",
        });
      }
    }
  }, [edited, isEditMode]);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;

    setEventData((prevEventData) => ({
      ...prevEventData,
      etablissement: selectedValue,
    }));
  };

  const handleSelectionChangeConge = (event) => {
    const selectedValue = event.target.value;

    setEventData((prevEventData) => ({
      ...prevEventData,
      justification: selectedValue,
    }));
  };

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSaveEvent = async (event) => {
    event.preventDefault();

    if (isEditMode) {
      await EventsAPI.update(edited.event_id, eventData);
    } else {
      await EventsAPI.create(eventData);
    }
    setIsLoading(true);
  };

  const handleDateChange = (newDate, target, agentID) => {
    const date = format(newDate.$d, "yyyy-MM-dd HH:mm:ss");

    if (isEditMode) {
      setEventData((prevEventData) => ({
        ...prevEventData,
        [target === "debut" ? "dateDebut" : "dateFin"]: date,
      }));
    } else {
      setEventData((prevEventData) => ({
        ...prevEventData,
        [target === "debut" ? "dateDebut" : "dateFin"]: date,
        agent: `/api/agents/${agentID}`,
      }));
    }
  };

  const renderEventSpecificFields = () => {
    if (type === "MISSION") {
      return (
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel>Etablissement</InputLabel>
            <Select
              value={eventData.etablissement}
              name="etablissement"
              onChange={handleSelectionChange}
              variant="filled"
              id="etablissement"
              className={"form-control"}
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
            value={eventData.autreEtablissement}
            fullWidth
            margin="normal"
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            label="Objet de la mission"
            name="objetMission"
            value={eventData.objetMission}
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Objectif et Quantification de travail"
            name="Quantification"
            value={eventData.Quantification}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            onChange={handleChange}
          />
        </div>
      );
    } else if (type === "REUNION") {
      return (
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel>Etablissement</InputLabel>
            <Select
              value={eventData.etablissement}
              name="etablissement"
              onChange={handleSelectionChange}
              variant="filled"
              id="etablissement"
              className={"form-control"}
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
            value={eventData.autreEtablissement}
            fullWidth
            margin="normal"
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            label="Objet de la Réunion"
            name="objetReunion"
            value={eventData.objetReunion}
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Ordre du jour"
            name="ordreJour"
            value={eventData.ordreJour}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            onChange={handleChange}
          />
        </div>
      );
    } else if (type === "ABSENCE") {
      return (
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel>Justificatif</InputLabel>
            <Select
              value={eventData.justification}
              name="justification"
              onChange={handleSelectionChangeConge}
            >
              <MenuItem value="">Sélectionnez un justificatif</MenuItem>
              {conges.map((conge, index) => (
                <MenuItem key={index} value={conge.label}>
                  {conge.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );
    }
  };

  return (
    <Grid container rowSpacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <Item className={type}>
          <Typography sx={{ p: 2 }}>{type}</Typography>
          <Box>
            {renderEventSpecificFields()}
            <Grid container spacing={1} style={{ marginTop: "10px" }}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={dayjs(eventData.dateDebut)}
                    label="Date et Heure de Début"
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    onChange={(newDate) =>
                      handleDateChange(newDate, "debut", props.admin_id)
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} style={{ marginBottom: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={dayjs(eventData.dateFin)}
                    label="Date et Heure de Fin"
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    onChange={(newDate) =>
                      handleDateChange(newDate, "fin", props.admin_id)
                    }
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <IconButton
              aria-label="delete"
              size="large"
              onClick={handleSaveEvent}
            >
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

export default EventForm;
