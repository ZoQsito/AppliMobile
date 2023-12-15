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
  Modal,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { applyPagination } from "../components/Pagination";
import { UsersTable } from "../components/Users/Users-table";
import { UsersSearch } from "../components/Users/Users-search";
import { useSelection } from "../components/hooks/use-selection";
import usersAPI from "../services/usersAPI";
import UserForm from "./UserForm";

const now = new Date();

const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [user, setUser] = useState([]);
  const [isModalOpen, setIsModalOpen,] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ModalUpdateOpen, setModalUpdateOpen] = useState(false);

  const handleDelete = async (selectedItems) => {
    try {
      usersAPI.deleteUsers(selectedItems);

      fetchUser();

      usersSelection.handleDeselectAll();
    } catch (error) {
      console.error("Error deleting Utilisateur:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const users = await usersAPI.findAll();
      setUser(users);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [!isModalOpen, !ModalUpdateOpen]);

  const paginatedUsers = useMemo(() => {
    return applyPagination(user, page, rowsPerPage);
  }, [user, page, rowsPerPage]);

  const usersIds = useMemo(() => {
    return user.map((userData) => userData.id);
  }, [user]);

  const usersSelection = useSelection(usersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleOpenModal = () => {
      setIsModalOpen(true)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenUpdateModal = (user) => {
    setSelectedUser(user);
    setModalUpdateOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedUser(null);
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
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Utilisateurs</Typography>
              </Stack>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleOpenModal()}
              >
                Créer Utilisateur
              </Button>
            </div>
            <UsersSearch />
            <UsersTable
              count={paginatedUsers.length}
              items={paginatedUsers}
              onDeselectAll={usersSelection.handleDeselectAll}
              onDeselectOne={usersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={usersSelection.handleSelectAll}
              onSelectOne={usersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={usersSelection.selected}
              onDelete={handleDelete}
              selectedUser={selectedUser}
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
                <UserForm onClose={handleCloseModal} />
              </Box>
            </Modal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default UsersPage;
