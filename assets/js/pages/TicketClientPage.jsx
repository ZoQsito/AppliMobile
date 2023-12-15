import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Modal,
  Typography,
} from "@mui/material";
import { useSelection } from "../components/hooks/use-selection";
import ticketAPI from "../services/ticketAPI";
import { TicketsClientTable } from "../components/TicketClient/TicketClient-table";
import { TicketsClientSearch } from "../components/TicketClient/TicketClient-search";
import { useAuth } from "../contexts/AuthContext";
import TicketForm from "./TicketForm";

const now = new Date();

const TicketClientPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tickets, setTickets] = useState([]);
  const [ticketsUpdate, setTicketsUpdate] = useState([]);
  const { etats, decodedToken, apps } = useAuth();
  const [activeEtat, setActiveEtat] = useState(null);
  const [allPressed, setAllPressed] = useState(true);
  const [isModalOpen, setIsModalOpen,] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ModalUpdateOpen, setModalUpdateOpen] = useState(false);

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
      const userTickets = data.filter(
        (ticket) => ticket?.userId?.id === UserId
      );

      setTickets(userTickets);
      setTicketsUpdate(userTickets);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [!isModalOpen, !ModalUpdateOpen]);

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

  const handleOpenModal = () => {
      setIsModalOpen(true)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalUpdateOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedTicket(null);
    setModalUpdateOpen(false);
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
                <Typography variant="h4">Tickets</Typography>
              </Stack>
            </Stack>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
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
              <Button
                variant="contained"
                color="success"
                onClick={() => handleOpenModal()}
              >
                Créer Tickets
              </Button>
            </div>
            <TicketsClientTable
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
              ModalUpdateOpen={ModalUpdateOpen}
              onOpenUpdateModal={handleOpenUpdateModal}
              onCloseUpdateModal={handleCloseUpdateModal}
            />
            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="ticket-modal"
              aria-describedby="ticket-details"
            >
              <Box style={{ marginTop: "200px" }}>
                <TicketForm onClose={handleCloseModal}/>
              </Box>
            </Modal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default TicketClientPage;
