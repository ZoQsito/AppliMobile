declare namespace _default {
    export { findAll };
    export { deleteRoles as delete };
    export { find };
    export { update };
    export { create };
}
export default _default;
declare function findAll(): Promise<any>;
declare function deleteRoles(id: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function find(id: any): Promise<any>;
declare function update(id: any, roles: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function create(roles: any): Promise<import("axios").AxiosResponse<any, any>>;
