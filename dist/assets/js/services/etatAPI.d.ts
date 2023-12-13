declare namespace _default {
    export { findAll };
    export { deleteEtats as delete };
    export { find };
    export { update };
    export { create };
}
export default _default;
declare function findAll(): Promise<any>;
declare function deleteEtats(id: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function find(id: any): Promise<any>;
declare function update(id: any, etats: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function create(etats: any): Promise<import("axios").AxiosResponse<any, any>>;
