import React, { useContext } from 'react';

export const AuthContext = React.createContext({
    decodedToken: null,
    isAdmin: false,
    isAuthenticated: false,
    setIsAuthenticated: value => {}
});

export const useAuth= ()=> useContext(AuthContext);