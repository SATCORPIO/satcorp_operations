import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const USERS = {
  ADMIN: {
    username: 'ANU@satcorp.io',
    password: 'Hess1862$',
    role: 'admin',
    projects: ['gendashv2', '450kpar', 'xoi-client']
  },
  ISS: {
    username: 'ISS@satcorp.io',
    password: 'Muscleman320$',
    role: 'client',
    projects: ['gendashv2', '450kpar']
  },
  DYSUN: {
    username: 'Dysun@satcorp.io',
    password: 'Ikickdodos556$',
    role: 'client',
    projects: ['xoi-client']
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
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  const extendSession = () => {
    setTimeLeft(900);
  };

  useEffect(() => {
    let timer;
    if (user && !loading) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else {
        logout();
      }
    }
    return () => clearInterval(timer);
  }, [user, timeLeft, loading]);

  useEffect(() => {
    const savedUser = localStorage.getItem('satcorp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setTimeLeft(900); // Reset timer on session restore
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
      setTimeLeft(900); // Reset timer on login
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: 'INVALID CREDENTIALS' };
  };

  const logout = () => {
    setUser(null);
    setTimeLeft(900);
    localStorage.removeItem('satcorp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, timeLeft, extendSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
