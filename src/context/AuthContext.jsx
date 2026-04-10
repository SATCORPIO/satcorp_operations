import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const USERS = {
  ADMIN: {
    username: 'ANU@satcorp.io',
    password: 'Hess1862$',
    role: 'admin',
    projects: ['gendashv2', '450kpar', 'xoi-client', 'xoi-audit', 'dualcore-900']
  },
  ISS: {
    username: 'ISS@satcorp.io',
    password: 'Muscleman320$',
    role: 'client',
    projects: ['gendashv2', '450kpar', 'dualcore-900']
  },
  DYSUN: {
    username: 'Dysun@satcorp.io',
    password: 'Ikickdodos556$',
    role: 'client',
    projects: ['xoi-client', 'xoi-audit']
  },
  BABAJOE: {
    username: 'babajoe1',
    password: 'Whoisjeff',
    role: 'client',
    projects: []
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    const savedUser = localStorage.getItem('satcorp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = Object.values(USERS).find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userSession = {
        username: foundUser.username,
        role: foundUser.role,
        projects: foundUser.projects
      };
      setUser(userSession);
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: 'INVALID CREDENTIALS' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('satcorp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
