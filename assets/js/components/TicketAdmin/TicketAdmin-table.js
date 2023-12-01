import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { SeverityPill } from "../Dashboard/severity-pill";
import TicketForm from "../../pages/TicketForm";

export const TicketsTable = (props) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const isModalOpen = Boolean(selectedTicket);
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    onDelete,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);

      return format(date, "dd/MM/yyyy");
    }
  };

  const statusMap = {
    Traitement: "warning",
    Ouvert: "primary",
    Ferme: "success",
  };

  const handleOpenModal = (ticket) => {
    if (document.activeElement.tagName.toLowerCase() !== "input") {
      setSelectedTicket(ticket);
    }
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  return (
    <>
      <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Application</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Date_Creation</TableCell>
                <TableCell>Date_Cloture</TableCell>
                <TableCell>Etat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((ticket) => {
                const isSelected = selected.includes(ticket.id);

                return (
                  <TableRow
                    hover
                    key={ticket.id}
                    selected={isSelected}
                    onClick={() => handleOpenModal(ticket)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(ticket.id);
                          } else {
                            onDeselectOne?.(ticket.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {ticket?.app?.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{ticket?.userId?.username}</TableCell>
                    <TableCell sortDirection="desc">
                      {formatDate(ticket.dateStart)}
                    </TableCell>
                    <TableCell>{formatDate(ticket.dateEnd)}</TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[ticket?.etat?.name]}>
                        {ticket?.etat?.name.toUpperCase()}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="ticket-modal"
          aria-describedby="ticket-details"
        >
          <Box>
            {selectedTicket && (
              <TicketForm ticket={selectedTicket} onClose={handleCloseModal} />
            )}
          </Box>
        </Modal>
      </Card>
      {selected.length > 0 && (
        <Button
          variant="contained"
          color="error"
          style={{ width: "100px" }}
          onClick={() => onDelete?.(selected)}
        >
          Supprimer
        </Button>
      )}
    </>
  );
};

TicketsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  onDelete: PropTypes.func,
};
