import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/roles")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/roles/" + id)
        .then(response => response.data);
}

function deleteRoles(id){
    return fetcher
        .delete("/api/roles/" + id)
}

function update(id, roles){
    return fetcher
    .put("/api/roles/" + id , roles);
}

function create(roles){
    return fetcher
    .post("/api/roles", roles);
}

export default{
    findAll,
    delete : deleteRoles,
    find,
    update,
    create
}