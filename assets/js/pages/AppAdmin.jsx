import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Box, Button, Container, Modal, Stack, Typography } from "@mui/material";
import { useSelection } from "../components/hooks/use-selection";
import { useAuth } from "../contexts/AuthContext";
import ApplicationAPI from "../services/ApplicationAPI";
import { AppTable } from "../components/APPTable/Application-table";
import { ApplicationSearch } from "../components/APPTable/Application-search";
import AppForm from "./AppForm";

const AppAdmin = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { apps, setApps } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalUpdateOpen, setModalUpdateOpen] = useState(false);

  const handleDelete = async (selectedItems) => {
    try {
      ApplicationAPI.delete(selectedItems);

      fetchApp();

      appSelection.handleDeselectAll();
    } catch (error) {
      console.error("Error deleting Application:", error);
    }
  };

  const fetchApp = async () => {
    try {
      const data = await ApplicationAPI.findAll();
      setApps(data);
    } catch (error) {
      console.error("Erreur lors du chargement des Applications :", error);
    }
  };
  

  useEffect(() => {
    fetchApp();
  }, [!isModalOpen]);

  const ApplicationIds = useMemo(() => {
    return apps?.map((app) => app.id);
  }, [apps]);

  const appSelection = useSelection(ApplicationIds);

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

const handleOpenUpdateModal = (app) => {
  setSelectedApp(app);
  setModalUpdateOpen(true);
};

const handleCloseUpdateModal = () => {
  setSelectedApp(null);
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
                  <Typography variant="h4">Application</Typography>
                </Stack>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleOpenModal()}
                >
                 Ajouter
                </Button>
              </div>
            <AppTable
              count={apps?.length}
              items={apps}
              onDeselectAll={appSelection?.handleDeselectAll}
              onDeselectOne={appSelection?.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={appSelection?.handleSelectAll}
              onSelectOne={appSelection?.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={appSelection?.selected}
              onDelete={handleDelete}
              selectedApp={selectedApp}
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
                <AppForm onClose={handleCloseModal} />
              </Box>
            </Modal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default AppAdmin;
