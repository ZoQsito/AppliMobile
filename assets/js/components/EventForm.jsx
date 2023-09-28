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
  Button,
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
import AddCircleIcon from '@mui/icons-material/AddCircle';

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

const EventFormMI = ({ props, setIsLoading, edited }) => {
  const [mission, setMission] = useState({
    etablissement: "",
    autreEtablissement: "",
    objetMission: "",
    Quantification: "",
    label: "MI",
    dateDebut: "",
    dateFin: "",
    agent: "",
  });

  const isEditMode = !!edited;

  useEffect(() => {
    if (isEditMode) {
      setMission({
        etablissement: edited.etablissement,
        autreEtablissement: edited.autreEtablissement,
        objetMission: edited.objetMission,
        Quantification: edited.quantification,
        label: edited.label,
        dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
        dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
        agent: `/api/agents/${edited.admin_id}`,
      });
    }
  }, [edited, isEditMode]);

  const handleSelectionChangeMI = (event) => {
    const selectedValue = event.target.value;

    setMission((prevMission) => ({
      ...prevMission,
      etablissement: selectedValue,
    }));
  };

  const handleChangeMI = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setMission({ ...mission, [name]: value });
  };

  const handleSaveMission = async (event) => {
    event.preventDefault();

    console.log(mission);

    if (isEditMode) {
      await EventsAPI.update(edited.event_id, mission);
    } else {
      await EventsAPI.create(mission);
    }
    setIsLoading(true);
  };

  const handleDateChange = (newDate, target, agentID) => {
    const date = format(newDate.$d, "yyyy-MM-dd HH:mm:ss");

    if (isEditMode) {
      if (target === "debut") {
        setMission((prevMission) => ({
          ...prevMission,
          dateDebut: date,
        }));
      } else if (target === "fin") {
        setMission((prevMission) => ({
          ...prevMission,
          dateFin: date,
        }));
      }
    } else {
      if (target === "debut") {
        setMission((prevMission) => ({
          ...prevMission,
          dateDebut: date,
          agent: `/api/agents/${agentID}`,
        }));
      } else if (target === "fin") {
        setMission((prevMission) => ({
          ...prevMission,
          dateFin: date,
        }));
      }
    }
  };

  return (
    <Grid container rowSpacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <Item className="Mission">
          <Typography sx={{ p: 2 }}>Mission</Typography>
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Etablissement</InputLabel>
              <Select
                value={mission.etablissement}
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
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={dayjs(mission.dateDebut)}
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
                    value={dayjs(mission.dateFin)}
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
            <IconButton aria-label="delete" size="large" onClick={handleSaveMission}>
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

const EventFormREU = ({ props, setIsLoading, edited }) => {
  const [reunion, setReunion] = useState({
    etablissement: "",
    autreEtablissement: "",
    objetReunion: "",
    ordreJour: "",
    label: "REU",
    dateDebut: "",
    dateFin: "",
    agent: "",
  });

  const isEditMode = !!edited;

  useEffect(() => {
    if (isEditMode) {
      setReunion({
        etablissement: edited.etablissement,
        autreEtablissement: edited.autreEtablissement,
        objetReunion: edited.objetReunion,
        ordreJour: edited.ordreJour,
        label: edited.label,
        dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
        dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
        agent: `/api/agents/${edited.admin_id}`,
      });
    }
  }, [edited, isEditMode]);

  const handleChangeRE = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setReunion({ ...reunion, [name]: value });
  };

  const handleSaveReunion = async (event) => {
    event.preventDefault();

    if (isEditMode) {
      await EventsAPI.update(edited.event_id, reunion);
    } else {
      await EventsAPI.create(reunion);
    }
    setIsLoading(true);
  };

  const handleSelectionChangeRE = (event) => {
    const selectedValue = event.target.value;

    setReunion((prevReunion) => ({
      ...prevReunion,
      etablissement: selectedValue,
    }));
  };

  const handleDateChange = (newDate, target, agentID) => {
    const date = format(newDate.$d, "yyyy-MM-dd HH:mm:ss");

    if (isEditMode) {
      if (target === "debut") {
        setReunion((prevReunion) => ({
          ...prevReunion,
          dateDebut: date,
        }));
      } else if (target === "fin") {
        setReunion((prevReunion) => ({
          ...prevReunion,
          dateFin: date,
        }));
      }
    } else {
      if (target === "debut") {
        setReunion((prevReunion) => ({
          ...prevReunion,
          dateDebut: date,
          agent: `/api/agents/${agentID}`,
        }));
      } else if (target === "fin") {
        setReunion((prevReunion) => ({
          ...prevReunion,
          dateFin: date,
        }));
      }
    }
  };

  return (
    <Grid container rowSpacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <Item className="Reunion">
          <Typography sx={{ p: 2 }}>Réunion</Typography>
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Etablissement</InputLabel>
              <Select
                value={reunion.etablissement}
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
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={dayjs(reunion.dateDebut)}
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
                    value={dayjs(reunion.dateFin)}
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
            <IconButton aria-label="delete" size="large" onClick={handleSaveReunion}>
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

const EventFormABS = ({ props, setIsLoading, edited }) => {
  const [conge, setConge] = useState({
    justification: "",
    label: "ABS",
    dateDebut: "",
    dateFin: "",
    agent: "",
  });

  const isEditMode = !!edited;

  useEffect(() => {
    if (isEditMode) {
      setConge({
        justification: edited.justification,
        label: edited.label,
        dateDebut: format(edited.start, "yyyy-MM-dd HH:mm:ss"),
        dateFin: format(edited.end, "yyyy-MM-dd HH:mm:ss"),
        agent: `/api/agents/${edited.admin_id}`,
      });
    }
  }, [edited, isEditMode]);

  const handleSelectionChangeConge = (event) => {
    const justificatif = event.target.value;

    setConge((prevConge) => ({
      ...prevConge,
      justification: justificatif,
    }));
  };

  const handleDateChange = (newDate, target, agentID) => {
    const date = format(newDate.$d, "yyyy-MM-dd HH:mm:ss");

    if (isEditMode) {
      if (target === "debut") {
        setConge((prevConge) => ({
          ...prevConge,
          dateDebut: date,
        }));
      } else if (target === "fin") {
        setConge((prevConge) => ({
          ...prevConge,
          dateFin: date,
        }));
      }
    } else {
      if (target === "debut") {
        setConge((prevConge) => ({
          ...prevConge,
          dateDebut: date,
          agent: `/api/agents/${agentID}`,
        }));
      } else if (target === "fin") {
        setConge((prevConge) => ({
          ...prevConge,
          dateFin: date,
        }));
      }
    }
  };

  const handleSaveConge = async (event) => {
    event.preventDefault();

    if (isEditMode) {
      await EventsAPI.update(edited.event_id, conge);
    } else {
      await EventsAPI.create(conge);
    }
    setIsLoading(true);
  };

  return (
    <Grid container rowSpacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <Item className="Conge">
          <Typography sx={{ p: 2 }}>Congés</Typography>
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Justificatif</InputLabel>
              <Select
                value={conge.justification}
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
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={dayjs(conge.dateDebut)}
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
                    value={dayjs(conge.dateFin)}
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
            <IconButton aria-label="delete" size="large" onClick={handleSaveConge}>
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
};

export { EventFormMI, EventFormREU, EventFormABS };
