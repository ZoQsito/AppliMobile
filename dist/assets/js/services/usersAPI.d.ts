declare namespace _default {
    export { register };
    export { findAll };
    export { deleteUsers };
    export { find };
    export { update };
    export { roleUpdate };
}
export default _default;
declare function register(user: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function findAll(): Promise<any>;
declare function deleteUsers(id: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function find(id: any): Promise<any>;
declare function update(id: any, user: any): Promise<import("axios").AxiosResponse<any, any>>;
declare function roleUpdate(id: any, roleUpdate: any): Promise<import("axios").AxiosResponse<any, any>>;
