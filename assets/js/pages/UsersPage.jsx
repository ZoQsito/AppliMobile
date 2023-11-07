import React, { useContext, useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import usersAPI from "../services/usersAPI";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorModeContext from "../services/ColorModeContext";
import RoleAPI from "../services/RoleAPI";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  const colorMode = useContext(ColorModeContext);
  const currentMode = colorMode.mode;

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.findAll();
      setUsers(data);
    } catch (error) {
      toast.error("Les utilisateurs n'ont pas été chargés");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDelete = async (id) => {
    const originalUsers = [...users];

    setUsers(users.filter((user) => user.id !== id));

    try {
      await usersAPI.deleteUsers(id);
      toast.success("L'utilisateur a bien été supprimé");
    } catch (error) {
      setUsers(originalUsers);
      toast.error("La suppression de l'utilisateur n'a pas pu fonctionner");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearch = ({ target }) => {
    setSearch(target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = Pagination.getData(
    filteredUsers,
    currentPage,
    itemsPerPage
  );

  const columns = [
    { field: "id", headerName: "Id", width: 70 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => (
        <Link
          to={`/user/${params.row.id}`}
          style={
            currentMode === "dark"
              ? { textDecoration: "none", color: "white" }
              : { textDecoration: "none", color: "black" }
          }
        >
          {params.row.username}
        </Link>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => <Typography>{params.row.role.name}</Typography>,
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon sx={{ display: { xs: "none", md: "flex" } }} />
        </Button>
      ),
    },
  ];

  return (
    <Container style={{ marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Lexend-SemiBold", sans-serif',
          }}
        >
          Liste des Utilisateurs
        </Typography>
      </div>
      <Paper>
        <TextField
          type="text"
          label="Rechercher..."
          onChange={handleSearch}
          value={search}
          fullWidth
          style={{ marginBottom: "1rem" }}
        />

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={paginatedUsers}
            columns={columns}
            pageSize={itemsPerPage}
            page={currentPage - 1}
            onPageChange={(page) => handlePageChange(page + 1)}
          />
        </div>

        {itemsPerPage < filteredUsers.length && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={filteredUsers.length}
            onPageChanged={handlePageChange}
          />
        )}
      </Paper>
    </Container>
  );
};

export default UsersPage;
