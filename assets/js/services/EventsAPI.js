import Axios from "axios";

function findAll(){
    return Axios
        .get("http://127.0.0.1:8000/api/events")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return Axios
        .get("http://localhost:8000/api/events/" + id)
        .then(response => response.data);
}

function deleteEvent(id){
    return Axios
        .delete("http://127.0.0.1:8000/api/events/" + id)
}

function update(id, events){
    return Axios
    .put("http://localhost:8000/api/events/" + id , events);
}

function create(events){
    return Axios
    .post("http://localhost:8000/api/events", events);
}

export default{
    findAll,
    delete : deleteEvent,
    find,
    update,
    create
}