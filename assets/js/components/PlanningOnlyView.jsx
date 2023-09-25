// PlanningEdit.js
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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AgentsAPI from "../services/AgentsAPI";
import EventsAPI from "../services/EventsAPI";
import { toast } from "react-toastify";


const PlanningOnlyView = ({ props, }) => {
    const [mode, setMode] = useState("default");
    const calendarRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [isLoading, setIsLoading] = useState(true)
  
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
          editable={false}
          deletable={false}
        />
      </Fragment>
    );
  };
  
  export default PlanningOnlyView;