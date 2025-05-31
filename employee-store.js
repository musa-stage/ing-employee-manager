// employee-store.js
import { ReduxHelper } from './redux/hooks.js';

class EmployeeStoreClass {
  constructor() {
    this.subscribers = [];
    ReduxHelper.subscribe(() => {
      this.subscribers.forEach(cb => cb());
    });
  }

  getAll() {
    return ReduxHelper.getAllEmployees();
  }

  get(id) {
    return ReduxHelper.getEmployeeById(id);
  }

  add(emp) {
    ReduxHelper.addEmployee(emp);
  }

  update(id, updated) {
    ReduxHelper.updateEmployee(id, updated);
  }

  delete(id) {
    ReduxHelper.deleteEmployee(id);
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }
}

export const EmployeeStore = new EmployeeStoreClass();
