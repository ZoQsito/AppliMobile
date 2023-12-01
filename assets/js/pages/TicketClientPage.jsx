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
  SvgIcon,
  Typography,
} from "@mui/material";
import { applyPagination } from "../components/Pagination";
import { useSelection } from "../components/hooks/use-selection";
import ticketAPI from "../services/ticketAPI";
import { TicketsClientTable } from "../components/TicketClient/TicketClient-table";
import { TicketsClientSearch } from "../components/TicketClient/TicketClient-search";
import { useAuth } from "../contexts/AuthContext";

const now = new Date();

const TicketClientPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tickets, setTickets] = useState([]);

  const { isAdmin, setIsAuthenticated, isAuthenticated, decodedToken } = useAuth();

  const UserId = decodedToken?.custom_data?.UserId

  const handleDelete = async (selectedItems) => {
    try {
      ticketAPI.delete(selectedItems)

      fetchTickets();

      ticketSelection.handleDeselectAll();
    } catch (error) {
      console.error("Error deleting tickets:", error);
    }
  };


  const fetchTickets = async () => {
    try {
      const data = await ticketAPI.findAll();
      const userTickets = data.filter(ticket => ticket?.userId?.id === UserId);
      setTickets(userTickets);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };


  useEffect(() => {
    fetchTickets();
  }, []);

  const paginatedTickets = useMemo(() => {
    return applyPagination(tickets, page, rowsPerPage);
  }, [tickets, page, rowsPerPage]);

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
            <TicketsClientSearch />
            <TicketsClientTable
              count={paginatedTickets.length}
              items={paginatedTickets}
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default TicketClientPage;
