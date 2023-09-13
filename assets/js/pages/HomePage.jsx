import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../styles/homepage.css";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import styled from "@mui/system/styled";
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
              <Typography sx={{ textAlign: "left" }}>{contact.name}</Typography>
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
                  variant="contained"
                  color={button.color}
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

const items = [
  {
    title: "DRH",
    contacts: [
      {
        name: "Loïc.D",
        buttons: [{ label: "ABS", color: "success" }],
        phone: "07 68 04 62 22",
      },
    ],
  },
  {
    title: "DSI",
    contacts: [
      {
        name: "Florian.R",
        buttons: [
          { label: "DI", color: "warning" },
          { label: "ABS", color: "success" },
        ],
        phone: "07 68 04 62 22",
      },
      {
        name: "Vincent.D",
        buttons: [
          { label: "DI", color: "warning" },
          { label: "DI", color: "warning" },
        ],
        phone: "06 42 58 08 11",
      },
    ],
  },
];

const HomePage = (props) => {
  return (
    <>
      <div className="calandar">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar className="calendar-container" />
        </LocalizationProvider>
      </div>
      <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} pb={2}>
          <Grid item xs={6}>
            <Item className="EDT">
              {items.map((item) =>
                createAccordionItem(item.title, item.contacts)
              )}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item className="Mission">
              <Typography sx={{ p: 2 }}>Mission</Typography>
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
                  label="Objet de la mission"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Objectif et Quantification de travail"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} >
            <Item className="Reunion">
              <Typography sx={{ p: 2 }}>Reunion</Typography>
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
                    <TextField {...params} label="Justification" />
                  )}
                />
              </Box>
            </Item>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default HomePage;
