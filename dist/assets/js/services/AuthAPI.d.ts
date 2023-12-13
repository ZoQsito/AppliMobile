declare namespace _default {
    export { authenticate };
    export { logout };
    export { setup };
    export { isAuthenticated };
}
export default _default;
declare function authenticate(credentials: any): Promise<boolean>;
declare function logout(): void;
declare function setup(): void;
declare function isAuthenticated(): boolean;
