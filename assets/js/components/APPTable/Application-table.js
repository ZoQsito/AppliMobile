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
import AppForm from "../../pages/AppForm";
import { applyPagination } from "../Pagination";

export const AppTable = (props) => {
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
    selectedApp,
    ModalUpdateOpen,
    onOpenUpdateModal,
    onCloseUpdateModal,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const handleDelete = () => {
    if (onDelete && selected.length > 0) {
      selected.forEach((appId) => {
        onDelete(appId);
      });

      onDeselectAll?.();
    }
  };

  const handleOpenModal = (app) => {
    if (document.activeElement.tagName.toLowerCase() !== "input") {
      onOpenUpdateModal(app);
    }
  };

  const handleCloseModal = () => {
    onCloseUpdateModal(null);
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
                <TableCell>Id</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Admin_Associé</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applyPagination(items, page, rowsPerPage).map((app) => {
                const isSelected = selected.includes(app.id);

                return (
                  <TableRow
                    hover
                    key={app.id}
                    selected={isSelected}
                    onClick={() => handleOpenModal(app)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(app.id);
                          } else {
                            onDeselectOne?.(app.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{app?.id}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{app?.name}</TableCell>
                    <TableCell>
                      {app?.users.map((user, index) => (
                        <React.Fragment key={user.id}>
                          {user.username}
                          {index < app.users.length - 1 && " / "}
                        </React.Fragment>
                      ))}
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
          open={ModalUpdateOpen}
          onClose={handleCloseModal}
          aria-labelledby="ticket-modal"
          aria-describedby="ticket-details"
        >
          <Box style={{ marginTop: "200px" }}>
            {selectedApp && (
              <AppForm app={selectedApp} onClose={handleCloseModal} />
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

AppTable.propTypes = {
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
