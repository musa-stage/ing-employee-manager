import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice.js';

// Middleware to save state to localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save to localStorage after every action that affects employees
  if (action.type.startsWith('employees/')) {
    const state = store.getState();
    try {
      localStorage.setItem('employee_records', JSON.stringify(state.employees.employees));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(localStorageMiddleware),
}); 