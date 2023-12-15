import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useSelection } from "../components/hooks/use-selection";
import ticketAPI from "../services/ticketAPI";
import { TicketsTable } from "../components/TicketAdmin/TicketAdmin-table";
import { TicketsSearch } from "../components/TicketAdmin/TicketAdmin-search";
import { useAuth } from "../contexts/AuthContext";


const TicketsAdminPersoPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tickets, setTickets] = useState([]);
  const [ticketsUpdate, setTicketsUpdate] = useState([]);
  const { etats, decodedToken } = useAuth();
  const [activeEtat, setActiveEtat] = useState(null);
  const [allPressed, setAllPressed] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const UserId = decodedToken?.custom_data?.UserId;

  const handleDelete = async (selectedItems) => {
    try {
      ticketAPI.delete(selectedItems);

      fetchTickets();

      ticketSelection.handleDeselectAll();
    } catch (error) {
      console.error("Error deleting tickets:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await ticketAPI.findAll();
      const filteredTickets = data.filter((ticket) =>
      ticket.app.users.some((user) => user.id === UserId)
    );
      setTickets(filteredTickets);
      setTicketsUpdate(filteredTickets);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [!isModalOpen]);


  const ticketsIds = useMemo(() => {
    return tickets.map((ticketData) => ticketData.id);
  }, [tickets]);

  const ticketSelection = useSelection(ticketsIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleEtatsChangeForAll = (selectedEtat) => {
    let filteredResources = etats;

    if (selectedEtat) {
      filteredResources = tickets.filter(
        (ticket) => ticket.etat.name === selectedEtat
      );
    }

    setTicketsUpdate(filteredResources);

    setAllPressed(false);
    setActiveEtat(selectedEtat);
  };

  const handleEtatsChange = () => {
    setAllPressed(true);
    setActiveEtat(null);
    setTicketsUpdate(tickets);
  };

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Tickets Admin Associé</Typography>
              </Stack>
            </Stack>
            <div
              style={{
                marginTop: "20px",
              }}
            >
                <Button
                  variant={allPressed ? "contained" : "outlined"}
                  style={{ marginRight: "10px" }}
                  onClick={() => handleEtatsChange()}
                >
                  TOUS
                </Button>
                {etats?.map((etats, index) => (
                  <Button
                    key={etats.id}
                    variant={
                      activeEtat === etats.name ? "contained" : "outlined"
                    }
                    style={{ marginRight: "10px" }}
                    onClick={() => handleEtatsChangeForAll(etats.name)}
                  >
                    {etats.name}
                  </Button>
                ))}
              </div>
            <TicketsTable
              count={ticketsUpdate.length}
              items={ticketsUpdate}
              onDeselectAll={ticketSelection.handleDeselectAll}
              onDeselectOne={ticketSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={ticketSelection.handleSelectAll}
              onSelectOne={ticketSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={ticketSelection.selected}
              onDelete={handleDelete}
              selectedTicket={selectedTicket}
              isModalOpen={isModalOpen}
              onOpenModal={handleOpenModal}
              onCloseModal={handleCloseModal}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default TicketsAdminPersoPage;
