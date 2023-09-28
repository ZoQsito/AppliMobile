import Axios from "axios";

function register(user){
    return Axios.post(
        "http://127.0.0.1:8000/api/users",
        user
      );
}

function find(id){
    return Axios
        .get("http://localhost:8000/api/users/" + id)
        .then(response => response.data);
}

function findAll(){
    return Axios
        .get("http://127.0.0.1:8000/api/users")
        .then(response =>response.data['hydra:member'])
}

function deleteUsers(id){
    return Axios
        .delete("http://127.0.0.1:8000/api/users/" + id)
}

function update(id, user){
    return Axios
    .put("http://localhost:8000/api/users/" + id , user);
}

export default{
    register,
    findAll,
    deleteUsers,
    find,
    update
}