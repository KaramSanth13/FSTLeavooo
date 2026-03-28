import React, { createContext, useReducer } from 'react';

const mockLeaves = [
  { id: 101, studentName: 'Karam Santh N', type: 'Sick Leave', startDate: '2023-11-10', endDate: '2023-11-12', status: 'Approved', reason: 'Viral Fever' },
  { id: 102, studentName: 'Shanjana G', type: 'Casual Leave', startDate: '2023-12-01', endDate: '2023-12-05', status: 'Pending', reason: 'Family Function' },
  { id: 103, studentName: 'Karam Santh N', type: 'Annual Leave', startDate: '2024-01-15', endDate: '2024-01-20', status: 'Rejected', reason: 'Project Deadline Clash' },
  { id: 104, studentName: 'Shanjana G', type: 'Sick Leave', startDate: '2024-02-05', endDate: '2024-02-06', status: 'Approved', reason: 'Dentist Appointment' },
];

const initialState = {
  leaves: JSON.parse(localStorage.getItem('leaves')) || mockLeaves,
  leaveBalance: {
    total: 20,
    taken: 8,
    pending: 5,
    monthlyBase: 2
  }
};

const leaveReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LEAVE':
      const updatedLeaves = [action.payload, ...state.leaves];
      localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
      return { ...state, leaves: updatedLeaves };
    default:
      return state;
  }
};

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveReducer, initialState);

  const applyLeave = (leaveData) => {
    const newLeave = {
      id: Date.now(),
      ...leaveData,
      status: 'Pending'
    };
    dispatch({ type: 'ADD_LEAVE', payload: newLeave });
  };

  return (
    <LeaveContext.Provider value={{ ...state, applyLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};
