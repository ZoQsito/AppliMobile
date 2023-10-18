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
  Button,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import EventsAPI from "../services/EventsAPI";
import { format, parse, setHours, setMinutes } from "date-fns";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { fr } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EtablissementAPI from "../services/EtablissementAPI";
import JustificatifAPI from "../services/JustificatifAPI";

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "2px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  borderRadius: "4px",
  textAlign: "center",
}));

const EventForm = ({ type, props, setIsLoading, edited, state }) => {
  const [etablissements, setEtablissements] = useState([]);
  const [justificatifs, setJustificatifs] = useState([]);

  const fetchData = async () => {
    try {
      const data = await EtablissementAPI.findAll();
      setEtablissements(data);
    } catch (error) {
      toast.error("Les Etablissements n'ont pas été chargés");
    }

    try {
      const data = await JustificatifAPI.findAll();
      setJustificatifs(data);
    } catch (error) {
      toast.error("Les Justificatifs n'ont pas été chargés");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(edited);

  const [eventDataConge, setEventDataConge] = useState({
    label: type,
    dateDebut: format(state.start.value, "yyyy-MM-dd HH:mm:ss"),
    dateFin: format(state.end.value, "yyyy-MM-dd HH:mm:ss"),
    agent: `/api/agents/${props.admin_id}`,
    justification: "",
  });

  const [eventData, setEventData] = useState({
    etablissement: "",
    autreEtablissement: "",
    label: type,
    dateDebut: format(state.start.value, "yyyy-MM-dd HH:mm:ss"),
    dateFin: format(state.end.value, "yyyy-MM-dd HH:mm:ss"),
    agent: `/api/agents/${props.admin_id}`,
    objetMission: "",
    quantification: "",
    objetReunion: "",
    ordreJour: "",
  });

  useEffect(() => {
    setEventData((prevEventData) => ({
      ...prevEventData,
      label: type,
      agent: `/api/agents/${props.admin_id}`,
      objetMission: "",
      quantification: "",
      objetReunion: "",
      ordreJour: "",
      justification: "",
    }));
    setEventDataConge((prevEventData) => ({
      ...prevEventData,
      label: type,
      agent: `/api/agents/${props.admin_id}`,
      justification: "",
    }));
  }, [type]);

  const isEditMode = !!edited;

  useEffect(() => {
    if (isEditMode) {
      if (type === edited.title) {
        setEventData({
          etablissement: edited.etablissement["@id"],
          autreEtablissement: edited.autreEtablissement,
          label: edited.title,
          dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
          agent: `/api/agents/${edited.admin_id}`,
          objetMission: edited.objetMission,
          quantification: edited.quantification,
          objetReunion: edited.objetReunion,
          ordreJour: edited.ordreJour,
        });
        setEventDataConge({
          label: edited.title,
          dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
          agent: `/api/agents/${edited.admin_id}`,
          justification: edited.justificatif["@id"],
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
        });
        setEventDataConge({
          label: type,
          dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
          agent: `/api/agents/${edited.admin_id}`,
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

    setEventDataConge((prevEventData) => ({
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

    if (type === "MISSION" || type === "REUNION") {
      if (isEditMode) {
        await EventsAPI.update(edited.event_id, eventData);
      } else {
        await EventsAPI.create(eventData);
      }
    } else {
      if (isEditMode) {
        await EventsAPI.update(edited.event_id, eventDataConge);
      } else {
        await EventsAPI.create(eventDataConge);
      }
    }

    setIsLoading(true);
  };

  const handleDateChange = (newDate, target) => {
    const date = format(newDate, "yyyy-MM-dd HH:mm:ss");

    setEventData((prevEventData) => ({
      ...prevEventData,
      [target === "debut" ? "dateDebut" : "dateFin"]: date,
    }));
    setEventDataConge((prevEventData) => ({
      ...prevEventData,
      [target === "debut" ? "dateDebut" : "dateFin"]: date,
    }));
  };

  const [selectedTimeRange1, setSelectedTimeRange] = useState(null);
  const [isDemiJourneeTwice, setIsDemiJourneeTwice] = useState(false);

  const handleTimeChange = (selectedTimeRange) => {
    const dateStr = eventData.dateDebut;

    if (selectedTimeRange === "Demi Journée") {
      setSelectedTimeRange("Demi Journée");
    } else {
      setSelectedTimeRange(selectedTimeRange);
    }

    const DateDebut = parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date());

    const newHoursDebutDemiAprem = 13;
    const newHoursDebut = 8;
    const newHoursFinDemi = 12;
    const newHoursFin = 17;
    const newMinutes = 0;

    const updatedDateDebut = setMinutes(
      setHours(DateDebut, newHoursDebut),
      newMinutes
    );

    const updatedDateDebutAprem = setMinutes(
      setHours(DateDebut, newHoursDebutDemiAprem),
      newMinutes
    );

    const updatedDateFin = setMinutes(
      setHours(DateDebut, newHoursFin),
      newMinutes
    );

    const updatedDateFinMatin = setMinutes(
      setHours(DateDebut, newHoursFinDemi),
      newMinutes
    );

    
    if (selectedTimeRange === "Demi Journée") {
      if(selectedTimeRange1 === selectedTimeRange){
        setEventData((prevEventData) => ({
          ...prevEventData,
          dateDebut: format(updatedDateDebutAprem, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(updatedDateFin, "yyyy-MM-dd HH:mm:ss"),
        }));
        setEventDataConge((prevEventData) => ({
          ...prevEventData,
          dateDebut: format(updatedDateDebutAprem, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(updatedDateFin, "yyyy-MM-dd HH:mm:ss"),
        }));
        setSelectedTimeRange(null)
      }else{
        setEventData((prevEventData) => ({
          ...prevEventData,
          dateDebut: format(updatedDateDebut, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(updatedDateFinMatin, "yyyy-MM-dd HH:mm:ss"),
        }));
        setEventDataConge((prevEventData) => ({
          ...prevEventData,
          dateDebut: format(updatedDateDebut, "yyyy-MM-dd HH:mm:ss"),
          dateFin: format(updatedDateFinMatin, "yyyy-MM-dd HH:mm:ss"),
        }));
      }
    } else {
      setEventData((prevEventData) => ({
        ...prevEventData,
        dateDebut: format(updatedDateDebut, "yyyy-MM-dd HH:mm:ss"),
        dateFin: format(updatedDateFin, "yyyy-MM-dd HH:mm:ss"),
      }));
      setEventDataConge((prevEventData) => ({
        ...prevEventData,
        dateDebut: format(updatedDateDebut, "yyyy-MM-dd HH:mm:ss"),
        dateFin: format(updatedDateFin, "yyyy-MM-dd HH:mm:ss"),
      }));
      setIsDemiJourneeTwice(false)
    }
  };

  console.log(eventData);
  console.log(eventDataConge);

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
              id="etablissement"
            >
              <MenuItem value="">Sélectionnez un établissement</MenuItem>
              {etablissements.map((etablissement, index) => (
                <MenuItem key={index} value={etablissement["@id"]}>
                  {etablissement.name}
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
            name="quantification"
            value={eventData.quantification}
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
              id="etablissement"
            >
              <MenuItem value="">Sélectionnez un établissement</MenuItem>
              {etablissements.map((etablissement, index) => (
                <MenuItem key={index} value={etablissement["@id"]}>
                  {etablissement.name}
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
              value={eventDataConge.justification}
              name="justification"
              onChange={handleSelectionChangeConge}
            >
              <MenuItem value="">Sélectionnez un justificatif</MenuItem>
              {justificatifs.map((justificatif, index) => (
                <MenuItem key={index} value={justificatif["@id"]}>
                  {justificatif.name}
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
            <Grid
              container
              spacing={1}
              style={{ marginTop: "10px", marginBottom: "20px" }}
            >
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTimeChange("Demi Journée")}
                >
                  Demi Journée
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTimeChange("Journée")}
                >
                  Journée
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: "10px" }}>
              <Grid item xs={6}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={fr}
                >
                  <DateTimePicker
                    value={new Date(eventData.dateDebut)}
                    label="Date et Heure de Début"
                    onChange={(newDate) => handleDateChange(newDate, "debut")}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} style={{ marginBottom: "10px" }}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={fr}
                >
                  <DateTimePicker
                    value={new Date(eventData.dateFin)}
                    label="Date et Heure de Fin"
                    onChange={(newDate) => handleDateChange(newDate, "fin")}
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
