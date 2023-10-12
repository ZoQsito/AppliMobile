import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import usersAPI from "../services/usersAPI";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des Utilisateurs</h1>
        <Link to="/user/new" className="btn btn-primary">
          Ajouter un Utilisateur
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
            <th>Username</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <Link to={`/user/${user.id}`} style={{ textDecoration: "none" }}>
                  {user.username}
                </Link>
              </td>
              <td>{user.roles[0]}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemsPerPage < filteredUsers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredUsers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </div>
  );
};

export default UsersPage;
