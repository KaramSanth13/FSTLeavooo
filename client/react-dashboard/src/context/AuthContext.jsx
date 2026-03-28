import React, { createContext, useReducer, useEffect } from 'react';

const mockUsers = [
  { id: 1, email: 'karam@test.com', password: 'password', name: 'Karam Santh N', role: 'Student' },
  { id: 2, email: 'shanjana@test.com', password: 'password', name: 'Shanjana G', role: 'Student' }
];

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true, error: null };
    case 'LOGIN_FAIL':
      return { ...state, user: null, isAuthenticated: false, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return { ...state, user: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
      return true;
    } else {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Invalid email or password. Use karam@test.com / password' });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
