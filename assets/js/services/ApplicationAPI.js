import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/applications")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/applications/" + id)
        .then(response => response.data);
}

function deleteApplications(id){
    return fetcher
        .delete("/api/applications/" + id)
}

function update(id, applications){
    return fetcher
    .put("/api/applications/" + id , applications);
}

function create(applications){
    return fetcher
    .post("/api/applications", applications);
}

export default{
    findAll,
    delete : deleteApplications,
    find,
    update,
    create
}