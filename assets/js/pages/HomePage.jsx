import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./homepage.css";
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
  { label: "Temps Partiel" }
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
        <Grid container spacing={8} pb={4}>
          <Grid item xs={6} md={4}>
            <Item>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ textAlign: "left" }}>DRH</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ textAlign: "left" }}>Loïc.D</Typography>
                    <div>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: "8px" }}
                      >
                        ABS
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: "8px" }}
                      >
                        ABS
                      </Button>
                    </div>
                  </div>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "left", pb: 2 }}
                  >
                    07 68 04 62 22
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography sx={{ textAlign: "left" }}>DSI</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ textAlign: "left" }}>
                      Florian.R
                    </Typography>
                    <div>
                      <Button
                        variant="contained"
                        color="warning"
                        style={{ marginRight: "8px" }}
                      >
                        DI
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: "8px" }}
                      >
                        ABS
                      </Button>
                    </div>
                  </div>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "left", pb: 2 }}
                  >
                    07 68 04 62 22
                  </Typography>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ textAlign: "left" }}>
                      Vincent.D
                    </Typography>
                    <div>
                      <Button
                        variant="contained"
                        color="warning"
                        style={{ marginRight: "8px" }}
                      >
                        DI
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        style={{ marginRight: "8px" }}
                      >
                        DI
                      </Button>
                    </div>
                  </div>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "left", pb: 2 }}
                  >
                    06 42 58 08 11
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Item>
          </Grid>
          <Grid item xs={6} md={8}>
            <Item>
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
        <Grid container spacing={8}>
          <Grid item xs={6} md={8}>
            <Item>
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
          <Grid item xs={6} md={4}>
            <Item>
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
