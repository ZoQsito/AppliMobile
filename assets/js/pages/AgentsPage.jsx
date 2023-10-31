import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import AgentsAPI from "../services/AgentsAPI";
import Pagination from "../components/Pagination";
import { useAuth } from "../contexts/AuthContext";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import ColorModeContext from "../services/ColorModeContext";

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  const { isRESP, decodedToken } =
    useAuth();

  const colorMode = useContext(ColorModeContext);
  const currentMode = colorMode.mode;


  const fetchAgents = async () => {
    try {
      const data = await AgentsAPI.findAll();
      setAgents(data);
    } catch (error) {
      toast.error("Les agents n'ont pas été chargés");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    const originalAgents = [...agents];
    setAgents(agents.filter((agent) => agent.id !== id));

    try {
      await AgentsAPI.delete(id);
      toast.success("L'agent a bien été supprimé");
    } catch (error) {
      setAgents(originalAgents);
      toast.error("La suppression de l'agent n'a pas pu fonctionner");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearch = ({ target }) => {
    setSearch(target.value);
    setCurrentPage(1);
  };

  const filteredAgents = agents.filter(
    (agent) =>
      (agent.nom.toLowerCase().includes(search.toLowerCase()) ||
        agent.prenom.toLowerCase().includes(search.toLowerCase()) ||
        agent?.service?.name.toLowerCase().includes(search.toLowerCase())) &&
      (isRESP
        ? decodedToken?.custom_data?.service
          ? agent.service.name === decodedToken?.custom_data?.service
          : true
        : true)
  );

  const paginatedAgents = Pagination.getData(
    filteredAgents,
    currentPage,
    itemsPerPage
  );

  const columns = [
    { field: "id", headerName: "Id", width: 70 },
    {
      field: "nom",
      headerName: "Nom",
      width: 200,
      renderCell: (params) => (
        <Link
          to={`/agent/${params.row.id}`}
          style={currentMode === 'dark' ? { textDecoration: "none", color: "white" } : {textDecoration: "none", color:"black"}}
        >
          {params.row.prenom} {params.row.nom}
        </Link>
      ),
    },
    { field: "telephone", headerName: "Téléphone", width: 150 },
    {
      field: "service.name",
      headerName: "Service",
      width: 150,
      renderCell: (params) => (
        <Typography>{params.row.service.name}</Typography>
      ),
    },
    {
      field: "user",
      headerName: "User_ID",
      width: 100,
      renderCell: (params) => (
        <Typography>
          {params.row.user ? parseInt(params.row.user.split("/").pop()) : ""}
        </Typography>
      ),
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
          Liste des Agents
        </Typography>
        <Link to="/agent/new" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="success">
            Ajouter un Agent
          </Button>
        </Link>
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
            rows={paginatedAgents}
            columns={columns}
            pageSize={itemsPerPage}
            page={currentPage - 1}
            onPageChange={(page) => handlePageChange(page + 1)}
          />
        </div>

        {itemsPerPage < filteredAgents.length && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={filteredAgents.length}
            onPageChanged={handlePageChange}
          />
        )}
      </Paper>
    </Container>
  );
};

export default AgentsPage;
