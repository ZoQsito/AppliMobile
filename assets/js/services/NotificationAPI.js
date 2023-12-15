import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/notifications")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/notifications/" + id)
        .then(response => response.data);
}

function deleteNotification(id){
    return fetcher
        .delete("/api/notifications/" + id)
}

function update(id, notifications){
    return fetcher
    .put("/api/notifications/" + id , notifications);
}

function create(notifications){
    return fetcher
    .post("/api/notifications", notifications);
}

export default{
    findAll,
    delete : deleteNotification,
    find,
    update,
    create
}