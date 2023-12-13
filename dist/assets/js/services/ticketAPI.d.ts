declare namespace _default {
    export { findAll };
    export { deleteTickets as delete };
    export { find };
    export { update };
    export { create };
}
export default _default;
declare function findAll(): Promise<any>;
declare function deleteTickets(id: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function find(id: any): Promise<any>;
declare function update(id: any, tickets: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function create(tickets: any): Promise<import("axios").AxiosResponse<any, any>>;
