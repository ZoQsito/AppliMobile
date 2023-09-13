import Axios from "axios";

function findAll(){
    return Axios
        .get("http://127.0.0.1:8000/api/agents")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return Axios
        .get("http://localhost:8000/api/agents/" + id)
        .then(response => response.data);
}

function deleteAgents(id){
    return Axios
        .delete("http://127.0.0.1:8000/api/agents/" + id)
}

function update(id, agents){
    return Axios
    .put("http://localhost:8000/api/agents/" + id , agents);
}

function create(agents){
    return Axios
    .post("http://localhost:8000/api/agents", agents);
}

export default{
    findAll,
    delete : deleteAgents,
    find,
    update,
    create
}