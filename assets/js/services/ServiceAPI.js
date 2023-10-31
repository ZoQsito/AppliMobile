import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/services")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/services/" + id)
        .then(response => response.data);
}

function deleteService(id){
    return fetcher
        .delete("/api/services/" + id)
}

function update(id, services){
    return fetcher
    .put("/api/services/" + id , services);
}

function create(services){
    return fetcher
    .post("/api/services", services);
}

export default{
    findAll,
    delete : deleteService,
    find,
    update,
    create
}