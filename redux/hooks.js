import { store } from './store.js';
import { 
  selectAllEmployees, 
  selectEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee 
} from './employeeSlice.js';

export class ReduxHelper {
  static getState() {
    return store.getState();
  }

  static dispatch(action) {
    return store.dispatch(action);
  }

  static subscribe(callback) {
    return store.subscribe(callback);
  }

  static getAllEmployees() {
    return selectAllEmployees(store.getState());
  }

  static getEmployeeById(id) {
    return selectEmployeeById(store.getState(), id);
  }

  static addEmployee(employee) {
    return store.dispatch(addEmployee(employee));
  }

  static updateEmployee(id, updates) {
    return store.dispatch(updateEmployee({ id, ...updates }));
  }

  static deleteEmployee(id) {
    return store.dispatch(deleteEmployee(id));
  }
} 