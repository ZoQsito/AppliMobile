import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { applyPagination } from '../components/Pagination';
import { UsersTable } from '../components/Users/Users-table';
import { UsersSearch } from '../components/Users/Users-search';
import { useSelection } from '../components/hooks/use-selection';
import usersAPI from "../services/usersAPI";

const now = new Date();

const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    try {
      const users = await usersAPI.findAll();
      setUser(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);



  const paginatedUsers = useMemo(() => {
    return applyPagination(user, page, rowsPerPage);
  }, [user, page, rowsPerPage]);

  const usersIds = useMemo(() => {
    return user.map((userData) => userData.id);
  }, [user]);

  const usersSelection = useSelection(usersIds);



  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Users
                </Typography>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Ajouté
                </Button>
              </div>
            </Stack>
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default UsersPage;
