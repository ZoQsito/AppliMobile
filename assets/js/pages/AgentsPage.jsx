import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import AgentsAPI from "../services/AgentsAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AgentsPage = (props) => {
  const [agents, setagents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  //permet de récupérer les customers
  const fetchAgents = async () => {
    try {
      const data = await AgentsAPI.findAll();
      setagents(data);
    } catch (error) {
      toast.error("Les agents n'ont pas été chargés");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  //gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    const originalAgents = [...agents];

    setagents(agents.filter((agents) => agents.id !== id));

    try {
      await AgentsAPI.delete(id);
      toast.success("L'agent a bien été supprimé");
    } catch (error) {
      setagents(originalAgents);
      toast.error("La suppression de l'agent n'a pas pu fonctionner");
    }
  };
  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  //gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  const filteredAgents = agents.filter(
    (a) =>
      a.nom.toLowerCase().includes(search.toLowerCase()) ||
      a.prenom.toLowerCase().includes(search.toLowerCase()) ||
      (a.service && a.service.toLowerCase().includes(search.toLowerCase()))
  );
  //pagination des données
  const paginatedAgents = Pagination.getData(
    filteredAgents,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Agents</h1>
        <Link to="/agent/new" className="btn btn-primary">
          Ajouté un Agent
        </Link>
      </div>

      <div className="form-group" style={{ paddingBottom: "20px" }}>
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Service</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedAgents.map((agents) => (
            <tr key={agents.id}>
              <td>{agents.id}</td>
              <td>
                <Link
                  to={"/agents/" + agents.id}
                  style={{ textDecoration: "none" }}
                >
                  {agents.prenom} {agents.nom}
                </Link>
              </td>
              <td>{agents.telephone.replace(/(\d{2})(?=\d)/g, "$1 ")}</td>
              <td>{agents.service}</td>
              <td>
                <button
                  onClick={() => handleDelete(agents.id)}
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
    </>
  );
};

export default AgentsPage;
