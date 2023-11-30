import React, { useEffect, useState } from "react";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { CardTicketOuvert } from "../components/Dashboard/Cards/CardTicketOuvert";
import { CardTicketFerme } from "../components/Dashboard/Cards/CardTicketFerme";
import { CardTotalTicket } from "../components/Dashboard/Cards/CardTotalTicket";
import { OverviewSales } from "../components/Dashboard/Chart/OverviewSales";
import { OverviewTraffic, TicketsOverview } from "../components/Dashboard/Chart/TicketsOverview";
import { LatestTickets } from "../components/Dashboard/LatestTickets";
import { CardTicketInProgress } from "../components/Dashboard/Cards/CardTicketInProgress";
import { useAuth } from "../contexts/AuthContext";
import ticketAPI from "../services/ticketAPI";


function HomePage() {
  const { isAdmin, setIsAuthenticated, isAuthenticated, decodedToken } = useAuth();

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const data = await ticketAPI.findAll();
      setTickets(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
    }
  };

  const ticketsFermes = tickets.filter(ticket => ticket.etat.name === 'Ferme');
  const ticketsOuvert = tickets.filter(ticket => ticket.etat.name === 'Ouvert');
  const ticketsTraitement = tickets.filter(ticket => ticket.etat.name === 'Traitement');

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <CardTicketOuvert value={ticketsOuvert.length} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <CardTicketInProgress value={ticketsTraitement.length} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <CardTicketFerme value={ticketsFermes.length} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <CardTotalTicket value={tickets.length} />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: "Last year",
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <TicketsOverview
                chartSeries={[Math.round(ticketsOuvert.length * 100 / tickets.length), Math.round(ticketsTraitement.length * 100 / tickets.length), Math.round(ticketsFermes.length * 100 / tickets.length)]}
                labels={["Ouvert", "Traitement", "Ferme"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <LatestTickets
                tickets={tickets}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default HomePage;
