export const AuthContext: React.Context<{
    decodedToken: null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: any) => void;
}>;
export function useAuth(): {
    decodedToken: null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: any) => void;
};
import React from 'react';
