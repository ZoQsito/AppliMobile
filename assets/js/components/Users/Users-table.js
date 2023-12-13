import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Stack,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import UserForm from "../../pages/UserForm";

export const UsersTable = (props) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const isModalOpen = Boolean(selectedUser);
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

  const handleOpenModal = (user) => {
    if (document.activeElement.tagName.toLowerCase() !== "input") {
      setSelectedUser(user);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
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
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>ROLE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const isSelected = selected.includes(user.id);

                return (
                  <TableRow
                    hover
                    key={user.id}
                    selected={isSelected}
                    onClick={() => handleOpenModal(user)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(user.id);
                          } else {
                            onDeselectOne?.(user.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {user.username}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.numero}</TableCell>
                    <TableCell>{user?.service?.name}</TableCell>
                    <TableCell>{user?.role?.name}</TableCell>
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
            {selectedUser && (
              <UserForm user={selectedUser} onClose={handleCloseModal} />
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

UsersTable.propTypes = {
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
