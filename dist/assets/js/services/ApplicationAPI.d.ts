declare namespace _default {
    export { findAll };
    export { deleteApplications as delete };
    export { find };
    export { update };
    export { create };
}
export default _default;
declare function findAll(): Promise<any>;
declare function deleteApplications(id: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function find(id: any): Promise<any>;
declare function update(id: any, applications: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function create(applications: any): Promise<import("axios").AxiosResponse<any, any>>;
