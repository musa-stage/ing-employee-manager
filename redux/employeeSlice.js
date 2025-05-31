import { createSlice } from '@reduxjs/toolkit';
import { dummyEmployees } from '../dummy-data.js';

const loadInitialState = () => {
  try {
    const serializedState = localStorage.getItem('employee_records');
    if (serializedState === null) {
      return { employees: dummyEmployees };
    }
    const employees = JSON.parse(serializedState);
    return { employees: employees.length > 0 ? employees : dummyEmployees };
  } catch (err) {
    return { employees: dummyEmployees };
  }
};

const initialState = loadInitialState();

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      const newEmployee = {
        ...action.payload,
        id: Date.now().toString()
      };
      state.employees.push(newEmployee);
    },
    
    updateEmployee: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.employees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...updates };
      }
    },
    
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    
    loadEmployees: (state, action) => {
      state.employees = action.payload;
    }
  }
});

export const { addEmployee, updateEmployee, deleteEmployee, loadEmployees } = employeeSlice.actions;

export const selectAllEmployees = (state) => state.employees.employees;
export const selectEmployeeById = (state, id) => 
  state.employees.employees.find(emp => emp.id === id);

export default employeeSlice.reducer; 