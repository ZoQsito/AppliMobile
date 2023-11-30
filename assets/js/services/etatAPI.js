import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/etats")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/etats/" + id)
        .then(response => response.data);
}

function deleteEtats(id){
    return fetcher
        .delete("/api/etats/" + id)
}

function update(id, etats){
    return fetcher
    .put("/api/etats/" + id , etats);
}

function create(etats){
    return fetcher
    .post("/api/etats", etats);
}

export default{
    findAll,
    delete : deleteEtats,
    find,
    update,
    create
}