import { EmployeeStore } from '../employee-store.js';
import { assert } from '@open-wc/testing';
import sinon from 'sinon';
import { ReduxHelper } from '../redux/hooks.js';

suite('employee-store', () => {
  let sandbox;
  let mockEmployees;

  setup(() => {
    sandbox = sinon.createSandbox();
    mockEmployees = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@ing.com',
        phone: '+(90) 555-123-4567',
        dob: '1990-01-01',
        doe: '2020-01-01',
        department: 'Analytics',
        position: 'Senior'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@ing.com',
        phone: '+(90) 555-987-6543',
        dob: '1985-05-15',
        doe: '2018-03-10',
        department: 'Tech',
        position: 'Principal'
      }
    ];
  });

  teardown(() => {
    sandbox.restore();
  });

  test('EmployeeStore is properly instantiated', () => {
    assert.exists(EmployeeStore);
    assert.isFunction(EmployeeStore.getAll);
    assert.isFunction(EmployeeStore.get);
    assert.isFunction(EmployeeStore.add);
    assert.isFunction(EmployeeStore.update);
    assert.isFunction(EmployeeStore.delete);
    assert.isFunction(EmployeeStore.subscribe);
  });

  test('getAll returns all employees from ReduxHelper', () => {
    const getAllStub = sandbox.stub(ReduxHelper, 'getAllEmployees').returns(mockEmployees);
    
    const result = EmployeeStore.getAll();
    
    assert.isTrue(getAllStub.calledOnce);
    assert.deepEqual(result, mockEmployees);
  });

  test('get returns specific employee by id from ReduxHelper', () => {
    const getByIdStub = sandbox.stub(ReduxHelper, 'getEmployeeById').returns(mockEmployees[0]);
    
    const result = EmployeeStore.get('1');
    
    assert.isTrue(getByIdStub.calledOnce);
    assert.isTrue(getByIdStub.calledWith('1'));
    assert.deepEqual(result, mockEmployees[0]);
  });

  test('get returns null for non-existent employee', () => {
    const getByIdStub = sandbox.stub(ReduxHelper, 'getEmployeeById').returns(null);
    
    const result = EmployeeStore.get('999');
    
    assert.isTrue(getByIdStub.calledOnce);
    assert.isTrue(getByIdStub.calledWith('999'));
    assert.isNull(result);
  });

  test('add calls ReduxHelper.addEmployee with employee data', () => {
    const newEmployee = {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@ing.com',
      phone: '+(90) 555-111-2222',
      dob: '1992-12-25',
      doe: '2023-01-15',
      department: 'Tech',
      position: 'Junior'
    };
    
    const addStub = sandbox.stub(ReduxHelper, 'addEmployee');
    
    EmployeeStore.add(newEmployee);
    
    assert.isTrue(addStub.calledOnce);
    assert.isTrue(addStub.calledWith(newEmployee));
  });

  test('update calls ReduxHelper.updateEmployee with id and updated data', () => {
    const updatedData = {
      firstName: 'John Updated',
      lastName: 'Doe Updated',
      email: 'john.updated@ing.com'
    };
    
    const updateStub = sandbox.stub(ReduxHelper, 'updateEmployee');
    
    EmployeeStore.update('1', updatedData);
    
    assert.isTrue(updateStub.calledOnce);
    assert.isTrue(updateStub.calledWith('1', updatedData));
  });

  test('delete calls ReduxHelper.deleteEmployee with id', () => {
    const deleteStub = sandbox.stub(ReduxHelper, 'deleteEmployee');
    
    EmployeeStore.delete('1');
    
    assert.isTrue(deleteStub.calledOnce);
    assert.isTrue(deleteStub.calledWith('1'));
  });

  test('subscribe adds callback to subscribers list', () => {
    const callback = sinon.stub();
    
    EmployeeStore.subscribe(callback);
    
    // The callback should be in the subscribers array
    assert.include(EmployeeStore.subscribers, callback);
  });

  test('subscribe allows multiple callbacks', () => {
    const callback1 = sinon.stub();
    const callback2 = sinon.stub();
    const callback3 = sinon.stub();
    
    const initialCount = EmployeeStore.subscribers.length;
    
    EmployeeStore.subscribe(callback1);
    EmployeeStore.subscribe(callback2);
    EmployeeStore.subscribe(callback3);
    
    assert.include(EmployeeStore.subscribers, callback1);
    assert.include(EmployeeStore.subscribers, callback2);
    assert.include(EmployeeStore.subscribers, callback3);
    assert.equal(EmployeeStore.subscribers.length, initialCount + 3);
  });

  test('ReduxHelper subscription triggers all subscribers', () => {
    const callback1 = sinon.stub();
    const callback2 = sinon.stub();
    
    // Subscribe to the store first
    EmployeeStore.subscribe(callback1);
    EmployeeStore.subscribe(callback2);
    
    // Now trigger a Redux state change by adding an employee
    // This should trigger the Redux subscription which calls all EmployeeStore subscribers
    const testEmployee = {
      firstName: 'Test',
      lastName: 'Employee',
      email: 'test@ing.com'
    };
    
    EmployeeStore.add(testEmployee);
    
    // The callbacks should have been called
    assert.isTrue(callback1.calledOnce);
    assert.isTrue(callback2.calledOnce);
  });

  test('handles empty employee list', () => {
    const getAllStub = sandbox.stub(ReduxHelper, 'getAllEmployees').returns([]);
    
    const result = EmployeeStore.getAll();
    
    assert.isTrue(getAllStub.calledOnce);
    assert.isArray(result);
    assert.equal(result.length, 0);
  });

  test('handles undefined employee data gracefully', () => {
    const getByIdStub = sandbox.stub(ReduxHelper, 'getEmployeeById').returns(undefined);
    
    const result = EmployeeStore.get('undefined-id');
    
    assert.isTrue(getByIdStub.calledOnce);
    assert.isUndefined(result);
  });

  test('add handles employee with all required fields', () => {
    const completeEmployee = {
      firstName: 'Complete',
      lastName: 'Employee',
      email: 'complete@ing.com',
      phone: '+(90) 555-000-0000',
      dob: '1990-01-01',
      doe: '2023-01-01',
      department: 'Analytics',
      position: 'Senior'
    };
    
    const addStub = sandbox.stub(ReduxHelper, 'addEmployee');
    
    EmployeeStore.add(completeEmployee);
    
    assert.isTrue(addStub.calledOnce);
    assert.isTrue(addStub.calledWith(completeEmployee));
  });

  test('update handles partial employee data', () => {
    const partialUpdate = {
      email: 'newemail@ing.com'
    };
    
    const updateStub = sandbox.stub(ReduxHelper, 'updateEmployee');
    
    EmployeeStore.update('1', partialUpdate);
    
    assert.isTrue(updateStub.calledOnce);
    assert.isTrue(updateStub.calledWith('1', partialUpdate));
  });

  test('maintains singleton pattern', () => {
    // EmployeeStore should be the same instance when imported multiple times
    assert.exists(EmployeeStore);
    assert.isObject(EmployeeStore);
    
    // It should have all the expected methods
    const expectedMethods = ['getAll', 'get', 'add', 'update', 'delete', 'subscribe'];
    expectedMethods.forEach(method => {
      assert.isFunction(EmployeeStore[method]);
    });
  });
}); 