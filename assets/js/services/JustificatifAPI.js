import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/justificatifs")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/justificatifs/" + id)
        .then(response => response.data);
}

function deleteJustificatif(id){
    return fetcher
        .delete("/api/justificatifs/" + id)
}

function update(id, justificatifs){
    return fetcher
    .put("/api/justificatifs/" + id , justificatifs);
}

function create(justificatifs){
    return fetcher
    .post("/api/justificatifs", justificatifs);
}

export default{
    findAll,
    delete : deleteJustificatif,
    find,
    update,
    create
}