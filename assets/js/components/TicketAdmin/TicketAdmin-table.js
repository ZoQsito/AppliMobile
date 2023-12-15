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
  TableSortLabel,
  Typography,
} from "@mui/material";
import { SeverityPill } from "../Dashboard/severity-pill";
import TicketForm from "../../pages/TicketForm";
import { applyPagination } from "../Pagination";

export const TicketsTable = (props) => {

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
    selectedTicket,
    isModalOpen,
    onOpenModal,
    onCloseModal,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("Date_Creation");

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const sortedItems = items.sort((a, b) => {
    const dateA = new Date(a.dateStart);
    const dateB = new Date(b.dateStart);
  
    if (sortOrder === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  const handleDelete = () => {
    if (onDelete && selected.length > 0) {
      selected.forEach((ticketId) => {
        onDelete(ticketId);
      });

      onDeselectAll?.();
    }
  };

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
      onOpenModal(ticket);
    }
  };

  const handleCloseModal = () => {
    onCloseModal()
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
                <TableCell sortDirection={sortBy === "Date_Creation" ? sortOrder : false}>
                  <TableSortLabel
                    active={sortBy === "Date_Creation"}
                    direction={sortOrder}
                    onClick={() => handleSort("Date_Creation")}
                  >
                    Date_Creation
                  </TableSortLabel>
                </TableCell>
                <TableCell>Date_Cloture</TableCell>
                <TableCell>Etat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applyPagination(sortedItems, page, rowsPerPage).map((ticket) => {
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
          <Box style={{ marginTop: "200px" }}>
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
          onClick={handleDelete}
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
