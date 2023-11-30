import fetcher from "./dataAcces";

function findAll(){
    return fetcher
        .get("/api/tickets")
        .then(response =>response.data['hydra:member'])
}

function find(id){
    return fetcher
        .get("/api/tickets/" + id)
        .then(response => response.data);
}

function deleteTickets(id){
    return fetcher
        .delete("/api/tickets/" + id)
}

function update(id, tickets){
    return fetcher
    .put("/api/tickets/" + id , tickets);
}

function create(tickets){
    return fetcher
    .post("/api/tickets", tickets);
}

export default{
    findAll,
    delete : deleteTickets,
    find,
    update,
    create
}