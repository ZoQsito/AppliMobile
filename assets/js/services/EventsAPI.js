import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/events")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/events/" + id)
        .then(response => response.data);
}

function deleteEvent(id){
    return fetcher
        .delete("/api/events/" + id)
}

function update(id, events){
    return fetcher
    .put("/api/events/" + id , events);
}

function create(events){
    return fetcher
    .post("/api/events", events);
}

export default{
    findAll,
    delete : deleteEvent,
    find,
    update,
    create
}