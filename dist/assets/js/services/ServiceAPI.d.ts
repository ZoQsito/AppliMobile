declare namespace _default {
    export { findAll };
    export { deleteService as delete };
    export { find };
    export { update };
    export { create };
}
export default _default;
declare function findAll(): Promise<any>;
declare function deleteService(id: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function find(id: any): Promise<any>;
declare function update(id: any, services: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function create(services: any): Promise<import("axios").AxiosResponse<any, any>>;
