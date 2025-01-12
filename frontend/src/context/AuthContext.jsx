import React, { createContext, useContext, useState } from 'react';

// Create a context to manage authentication state
const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: localStorage.getItem('authenticated') === 'true' || false,
    role: localStorage.getItem('role') || null,
  });

  return (
    <AuthContext.Provider value={{ ...authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
