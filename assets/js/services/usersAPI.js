import fetcher, { fetcherPatch } from "./dataAcces";


function register(user){
    return fetcher.post(
        "/api/users",
        user
      );
}

function find(id){
    return fetcher
        .get("/api/users/" + id)
        .then(response => response.data);
}

function findAll(){
    return fetcher
        .get("/api/users")
        .then(response =>response.data['hydra:member'])
}

function deleteUsers(id){
    return fetcher
        .delete("/api/users/" + id)
}

function update(id, user){
    return fetcher
    .put("/api/users/" + id , user);
}

function updatePatch(id, user){
    return fetcherPatch
    .patch("/api/users/" + id , user);
}

function roleUpdate(id, roleUpdate){
    return fetcher
    .put(`/api/users/${id}/role` , roleUpdate)
}

export default{
    register,
    findAll,
    deleteUsers,
    find,
    update,
    roleUpdate,
    updatePatch,
}