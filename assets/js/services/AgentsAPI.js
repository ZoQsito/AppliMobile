import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/agents")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/agents/" + id)
        .then(response => response.data);
}

function deleteAgents(id){
    return fetcher
        .delete("/api/agents/" + id)
}

function update(id, agents){
    return fetcher
    .put("/api/agents/" + id , agents);
}

function create(agents){
    return fetcher
    .post("/api/agents", agents);
}

export default{
    findAll,
    delete : deleteAgents,
    find,
    update,
    create
}