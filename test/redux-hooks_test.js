import { ReduxHelper } from '../redux/hooks.js';
import { assert } from '@open-wc/testing';
import sinon from 'sinon';

suite('redux-hooks', () => {
  let sandbox;
  let mockEmployee;

  setup(() => {
    sandbox = sinon.createSandbox();
    mockEmployee = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@ing.com',
      phone: '+(90) 555-123-4567',
      dob: '1990-01-01',
      doe: '2020-01-01',
      department: 'Analytics',
      position: 'Senior'
    };
  });

  teardown(() => {
    sandbox.restore();
    // Clear all employees by getting current ones and deleting them
    const employees = ReduxHelper.getAllEmployees();
    employees.forEach(emp => ReduxHelper.deleteEmployee(emp.id));
  });

  test('ReduxHelper is properly defined', () => {
    assert.exists(ReduxHelper);
    assert.isFunction(ReduxHelper.getAllEmployees);
    assert.isFunction(ReduxHelper.getEmployeeById);
    assert.isFunction(ReduxHelper.addEmployee);
    assert.isFunction(ReduxHelper.updateEmployee);
    assert.isFunction(ReduxHelper.deleteEmployee);
    assert.isFunction(ReduxHelper.subscribe);
    assert.isFunction(ReduxHelper.getState);
    assert.isFunction(ReduxHelper.dispatch);
  });

  test('getAllEmployees returns array', () => {
    const employees = ReduxHelper.getAllEmployees();
    assert.isArray(employees);
  });

  test('addEmployee adds employee to store', () => {
    const initialCount = ReduxHelper.getAllEmployees().length;
    
    ReduxHelper.addEmployee(mockEmployee);
    
    const employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount + 1);
    
    const addedEmployee = employees.find(emp => emp.firstName === 'John' && emp.lastName === 'Doe');
    assert.exists(addedEmployee);
    assert.equal(addedEmployee.firstName, 'John');
    assert.equal(addedEmployee.lastName, 'Doe');
    assert.equal(addedEmployee.email, 'john.doe@ing.com');
  });

  test('addEmployee generates unique ID when not provided', () => {
    const employeeWithoutId = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@ing.com'
    };
    
    const initialCount = ReduxHelper.getAllEmployees().length;
    
    ReduxHelper.addEmployee(employeeWithoutId);
    
    const employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount + 1);
    
    const addedEmployee = employees.find(emp => emp.firstName === 'Jane');
    assert.exists(addedEmployee);
    assert.exists(addedEmployee.id);
    assert.isString(addedEmployee.id);
  });

  test('getEmployeeById returns correct employee', () => {
    ReduxHelper.addEmployee(mockEmployee);
    
    const employees = ReduxHelper.getAllEmployees();
    const addedEmployee = employees.find(emp => emp.firstName === 'John' && emp.lastName === 'Doe');
    
    const retrievedEmployee = ReduxHelper.getEmployeeById(addedEmployee.id);
    
    assert.exists(retrievedEmployee);
    assert.equal(retrievedEmployee.id, addedEmployee.id);
    assert.equal(retrievedEmployee.firstName, 'John');
    assert.equal(retrievedEmployee.email, 'john.doe@ing.com');
  });

  test('getEmployeeById returns undefined for non-existent ID', () => {
    const retrievedEmployee = ReduxHelper.getEmployeeById('999');
    assert.isUndefined(retrievedEmployee);
  });

  test('updateEmployee updates existing employee', () => {
    ReduxHelper.addEmployee(mockEmployee);
    
    const employees = ReduxHelper.getAllEmployees();
    const addedEmployee = employees.find(emp => emp.firstName === 'John' && emp.lastName === 'Doe');
    
    const updates = {
      firstName: 'John Updated',
      email: 'john.updated@ing.com'
    };
    
    ReduxHelper.updateEmployee(addedEmployee.id, updates);
    
    const updatedEmployee = ReduxHelper.getEmployeeById(addedEmployee.id);
    assert.equal(updatedEmployee.firstName, 'John Updated');
    assert.equal(updatedEmployee.email, 'john.updated@ing.com');
    assert.equal(updatedEmployee.lastName, 'Doe'); // Should keep original value
  });

  test('updateEmployee handles non-existent employee gracefully', () => {
    const initialCount = ReduxHelper.getAllEmployees().length;
    const updates = { firstName: 'Updated' };
    
    // Should not throw error
    ReduxHelper.updateEmployee('999', updates);
    
    const employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount);
  });

  test('deleteEmployee removes employee from store', () => {
    const initialCount = ReduxHelper.getAllEmployees().length;
    
    ReduxHelper.addEmployee(mockEmployee);
    assert.equal(ReduxHelper.getAllEmployees().length, initialCount + 1);
    
    const employees = ReduxHelper.getAllEmployees();
    const addedEmployee = employees.find(emp => emp.firstName === 'John' && emp.lastName === 'Doe');
    
    ReduxHelper.deleteEmployee(addedEmployee.id);
    
    const finalEmployees = ReduxHelper.getAllEmployees();
    assert.equal(finalEmployees.length, initialCount);
  });

  test('deleteEmployee handles non-existent employee gracefully', () => {
    const initialCount = ReduxHelper.getAllEmployees().length;
    
    // Should not throw error
    ReduxHelper.deleteEmployee('999');
    
    const employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount);
  });

  test('subscribe notifies listeners of state changes', () => {
    const listener = sinon.stub();
    
    ReduxHelper.subscribe(listener);
    
    // Add an employee to trigger state change
    ReduxHelper.addEmployee(mockEmployee);
    
    assert.isTrue(listener.calledOnce);
  });

  test('multiple subscribers are all notified', () => {
    const listener1 = sinon.stub();
    const listener2 = sinon.stub();
    const listener3 = sinon.stub();
    
    ReduxHelper.subscribe(listener1);
    ReduxHelper.subscribe(listener2);
    ReduxHelper.subscribe(listener3);
    
    // Add an employee to trigger state change
    ReduxHelper.addEmployee(mockEmployee);
    
    assert.isTrue(listener1.calledOnce);
    assert.isTrue(listener2.calledOnce);
    assert.isTrue(listener3.calledOnce);
  });

  test('state persists between operations', () => {
    const initialCount = ReduxHelper.getAllEmployees().length;
    
    ReduxHelper.addEmployee(mockEmployee);
    
    let employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount + 1);
    
    const addedEmployee = employees.find(emp => emp.firstName === 'John' && emp.lastName === 'Doe');
    
    ReduxHelper.updateEmployee(addedEmployee.id, { firstName: 'Updated John' });
    
    employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount + 1);
    
    const updatedEmployee = employees.find(emp => emp.id === addedEmployee.id);
    assert.equal(updatedEmployee.firstName, 'Updated John');
    
    const secondEmployee = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@ing.com'
    };
    
    ReduxHelper.addEmployee(secondEmployee);
    
    employees = ReduxHelper.getAllEmployees();
    assert.equal(employees.length, initialCount + 2);
  });

  test('addEmployee with partial data fills in defaults', () => {
    const partialEmployee = {
      firstName: 'Partial',
      lastName: 'Employee'
    };
    
    ReduxHelper.addEmployee(partialEmployee);
    
    const employees = ReduxHelper.getAllEmployees();
    const addedEmployee = employees.find(emp => emp.firstName === 'Partial');
    
    assert.equal(addedEmployee.firstName, 'Partial');
    assert.equal(addedEmployee.lastName, 'Employee');
    assert.exists(addedEmployee.id);
  });

  test('updateEmployee with partial data preserves existing fields', () => {
    ReduxHelper.addEmployee(mockEmployee);
    
    const employees = ReduxHelper.getAllEmployees();
    const addedEmployee = employees.find(emp => emp.firstName === 'John' && emp.lastName === 'Doe');
    
    const partialUpdate = {
      firstName: 'Updated John'
    };
    
    ReduxHelper.updateEmployee(addedEmployee.id, partialUpdate);
    
    const updatedEmployee = ReduxHelper.getEmployeeById(addedEmployee.id);
    assert.equal(updatedEmployee.firstName, 'Updated John');
    assert.equal(updatedEmployee.lastName, 'Doe'); // Should be preserved
    assert.equal(updatedEmployee.email, 'john.doe@ing.com'); // Should be preserved
  });

}); 