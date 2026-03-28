import React, { createContext, useReducer, useCallback } from 'react';
import api from '../services/api';

const initialState = {
  leaves: [],
  loading: false,
  error: null
};

const leaveReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_LEAVES_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_LEAVES_SUCCESS':
      return { ...state, loading: false, leaves: action.payload };
    case 'FETCH_LEAVES_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_LEAVE':
      return { 
        ...state, 
        leaves: state.leaves.map(l => l._id === action.payload._id ? action.payload : l) 
      };
    default:
      return state;
  }
};

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveReducer, initialState);

  const fetchLeaves = useCallback(async () => {
    dispatch({ type: 'FETCH_LEAVES_REQUEST' });
    try {
      const res = await api.get('/leaves');
      // Sort newest first
      const sorted = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      dispatch({ type: 'FETCH_LEAVES_SUCCESS', payload: sorted });
    } catch (err) {
      dispatch({ type: 'FETCH_LEAVES_FAIL', payload: err.response?.data?.error });
    }
  }, []);

  const applyLeaveForm = async (formData) => {
    const res = await api.post('/leaves', formData);
    return res.data;
  };

  const modifyEndDate = async (id, newEndDate) => {
    const res = await api.put(`/leaves/modify/${id}`, { endDate: newEndDate });
    dispatch({ type: 'UPDATE_LEAVE', payload: res.data.data });
    return res.data;
  };

  return (
    <LeaveContext.Provider value={{ ...state, fetchLeaves, applyLeaveForm, modifyEndDate }}>
      {children}
    </LeaveContext.Provider>
  );
};
