import React, { useContext } from 'react';

export const AuthContext = React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: value => {}
});

export const useAuth= ()=> useContext(AuthContext);