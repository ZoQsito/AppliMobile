import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AgentsAPI from "../services/AgentsAPI";
import Pagination from "../components/Pagination";
import jwtDecode from "jwt-decode";
import usersAPI from "../services/usersAPI";
import { useAuth } from "../contexts/AuthContext";

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  const { isAdmin, setIsAuthenticated, isAuthenticated, isRESP, decodedToken } = useAuth();

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
        agent.prenom.toLowerCase().includes(search.toLowerCase()) || agent.service.toLowerCase().includes(search.toLowerCase())) &&
        (isRESP ? (decodedToken?.custom_data?.service ? agent.service === decodedToken?.custom_data?.service : true) : true)
  );

  const paginatedAgents = Pagination.getData(
    filteredAgents,
    currentPage,
    itemsPerPage
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des Agents</h1>
        <Link to="/agent/new" className="btn btn-primary">
          Ajouter un Agent
        </Link>
      </div>

      <div className="form-group" style={{ paddingBottom: 20 }}>
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Service</th>
            <th>User_ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedAgents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.id}</td>
              <td>
                <Link
                  to={`/agent/${agent.id}`}
                  style={{ textDecoration: "none" }}
                >
                  {agent.prenom} {agent.nom}
                </Link>
              </td>
              <td>{agent.telephone.replace(/(\d{2})(?=\d)/g, "$1 ")}</td>
              <td>{agent.service}</td>
              <td>{agent.user ? parseInt(agent.user.split("/").pop()) : ""}</td>
              <td>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemsPerPage < filteredAgents.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredAgents.length}
          onPageChanged={handlePageChange}
        />
      )}
    </div>
  );
};

export default AgentsPage;
