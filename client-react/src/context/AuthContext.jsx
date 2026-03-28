import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, user: action.payload.user, isAuthenticated: true, loading: false, error: null };
    case 'LOGIN_FAIL':
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        try {
          const res = await api.get('/auth/me');
          dispatch({ type: 'USER_LOADED', payload: res.data.data });
        } catch (err) {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.user.role === 'Admin' || res.data.user.role === 'HOD') {
         // Stop approvers from logging into applicant portal
         dispatch({ type: 'LOGIN_FAIL', payload: 'Approvers must use the Approver Portal.'});
         return false;
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return true;
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.response?.data?.error || 'Invalid credentials' });
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
