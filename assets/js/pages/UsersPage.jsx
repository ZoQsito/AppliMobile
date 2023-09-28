import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import AgentsAPI from "../services/AgentsAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import usersAPI from "../services/usersAPI";

const UsersPage = (props) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");


  const fetchUsers = async () => {
    try {
      const data = await usersAPI.findAll();
      setUsers(data);
    } catch (error) {
      toast.error("Les users n'ont pas été chargés");
    }
  };

  console.log(users)

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const originalUsers = [...users];

    setUsers(users.filter((users) => users.id !== id));

    try {
      await usersAPI.deleteUsers(id);
      toast.success("Le user a bien été supprimé");
    } catch (error) {
      setUsers(originalUsers);
      toast.error("La suppression du user n'a pas pu fonctionner");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);


  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  const filteredUsers = users.filter(
    (a) =>
      a.username.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = Pagination.getData(
    filteredUsers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Users</h1>
        <Link to="/user/new" className="btn btn-primary">
          Ajouter un User
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
                <Link
                  to={"/user/" + user.id}
                  style={{ textDecoration: "none" }}
                >
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
    </>
  );
};

export default UsersPage;
