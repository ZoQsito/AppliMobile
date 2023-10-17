import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/etablissements")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/etablissements/" + id)
        .then(response => response.data);
}

function deleteEtablissement(id){
    return fetcher
        .delete("/api/etablissements/" + id)
}

function update(id, etablissements){
    return fetcher
    .put("/api/etablissements/" + id , etablissements);
}

function create(etablissements){
    return fetcher
    .post("/api/etablissements", etablissements);
}

export default{
    findAll,
    delete : deleteEtablissement,
    find,
    update,
    create
}