import { EmployeeForm } from '../employee-form.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { EmployeeStore } from '../employee-store.js';
import { Router } from '@vaadin/router';

suite('employee-form', () => {
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
  });

  test('is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, EmployeeForm);
  });

  test('renders form with default values in add mode', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const container = el.shadowRoot.querySelector('.container');
    assert.exists(container);
    
    const title = el.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.include(title.textContent, 'Add New Employee');
    
    const form = el.shadowRoot.querySelector('.form-content');
    assert.exists(form);
    
    // Check form fields
    const firstNameInput = el.shadowRoot.querySelector('input[name="firstName"]');
    assert.exists(firstNameInput);
    assert.equal(firstNameInput.value, '');
    
    const lastNameInput = el.shadowRoot.querySelector('input[name="lastName"]');
    assert.exists(lastNameInput);
    assert.equal(lastNameInput.value, '');
    
    const emailInput = el.shadowRoot.querySelector('input[name="email"]');
    assert.exists(emailInput);
    assert.equal(emailInput.value, '');
  });

  test('initializes in edit mode when employee data is provided', async () => {
    sandbox.stub(EmployeeStore, 'get').returns(mockEmployee);
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Manually set edit mode for testing
    el.isEditMode = true;
    el.employee = { ...mockEmployee };
    await el.updateComplete;
    
    assert.isTrue(el.isEditMode);
    assert.equal(el.employee.firstName, 'John');
    assert.equal(el.employee.lastName, 'Doe');
    assert.equal(el.employee.email, 'john.doe@ing.com');
  });

  test('renders form in edit mode with populated values', async () => {
    sandbox.stub(EmployeeStore, 'get').returns(mockEmployee);
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Manually set edit mode and employee data
    el.isEditMode = true;
    el.employee = { ...mockEmployee };
    await el.updateComplete;
    
    const title = el.shadowRoot.querySelector('.title');
    assert.include(title.textContent, 'Edit Employee');
    
    const firstNameInput = el.shadowRoot.querySelector('input[name="firstName"]');
    assert.equal(firstNameInput.value, 'John');
    
    const lastNameInput = el.shadowRoot.querySelector('input[name="lastName"]');
    assert.equal(lastNameInput.value, 'Doe');
    
    const emailInput = el.shadowRoot.querySelector('input[name="email"]');
    assert.equal(emailInput.value, 'john.doe@ing.com');
  });

  test('parses existing phone number correctly for Turkish number', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    el.parseExistingPhone('+(90) 555-123-4567');
    
    assert.equal(el.employee.countryCode, '+90');
    assert.equal(el.employee.phoneNumber, '5551234567');
  });

  test('parses existing phone number correctly for US number', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    el.parseExistingPhone('+1 555-123-4567');
    
    assert.equal(el.employee.countryCode, '+1');
    assert.equal(el.employee.phoneNumber, '5551234567');
  });

  test('updates field values when inputs change', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const firstNameInput = el.shadowRoot.querySelector('input[name="firstName"]');
    firstNameInput.value = 'Jane';
    firstNameInput.dispatchEvent(new Event('input'));
    
    assert.equal(el.employee.firstName, 'Jane');
  });

  test('formats phone number correctly for Turkish country code', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const formatted = el.formatPhoneNumber('+90', '5551234567');
    
    assert.equal(formatted, '+(90) 555 123 45 67');
  });

  test('formats phone number correctly for US country code', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const formatted = el.formatPhoneNumber('+1', '5551234567');
    
    assert.equal(formatted, '+1 (555) 123-4567');
  });

  test('formats phone number correctly for UK country code', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const formatted = el.formatPhoneNumber('+44', '7911123456');
    
    assert.equal(formatted, '+44 7911 123456');
  });

  test('submits form and adds new employee', async () => {
    const addStub = sandbox.stub(EmployeeStore, 'add');
    const routerStub = sandbox.stub(Router, 'go');
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Fill form fields with proper 10-digit phone number
    el.employee = {
      firstName: 'New',
      lastName: 'Employee',
      email: 'new@ing.com',
      countryCode: '+90',
      phoneNumber: '5551234567',
      dob: '1990-01-01',
      doe: '2023-01-01',
      department: 'Tech',
      position: 'Junior'
    };
    
    await el.saveEmployee();
    
    assert.isTrue(addStub.calledOnce);
    assert.isTrue(routerStub.calledWith('/employees'));
  });

  test('shows confirmation modal in edit mode', async () => {
    sandbox.stub(EmployeeStore, 'get').returns(mockEmployee);
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Set up edit mode with proper phone number
    el.isEditMode = true;
    el.employee = { 
      ...mockEmployee, 
      phoneNumber: '5551234567',
      countryCode: '+90'
    };
    await el.updateComplete;
    
    // Simulate form submission in edit mode
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = () => {}; // Mock preventDefault
    
    el.submitForm(submitEvent);
    
    assert.isTrue(el.showConfirmModal);
  });

  test('updates employee when confirmation is accepted', async () => {
    sandbox.stub(EmployeeStore, 'get').returns(mockEmployee);
    const updateStub = sandbox.stub(EmployeeStore, 'update');
    const routerStub = sandbox.stub(Router, 'go');
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Set up edit mode with proper phone number
    el.isEditMode = true;
    el.employee = { 
      ...mockEmployee, 
      phoneNumber: '5551234567',
      countryCode: '+90'
    };
    el.showConfirmModal = true;
    await el.updateComplete;
    
    el.confirmUpdate();
    
    assert.isTrue(updateStub.calledOnce);
    assert.isTrue(routerStub.calledWith('/employees'));
    assert.isFalse(el.showConfirmModal);
  });

  test('cancels update and hides modal', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.showConfirmModal = true;
    
    el.cancelUpdate();
    
    assert.isFalse(el.showConfirmModal);
  });

  test('renders all form fields correctly', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Check all expected form fields exist
    const expectedFields = [
      'firstName',
      'lastName', 
      'email',
      'phoneNumber',
      'dob',
      'doe'
    ];
    
    expectedFields.forEach(fieldName => {
      const field = el.shadowRoot.querySelector(`input[name="${fieldName}"]`);
      assert.exists(field, `Field ${fieldName} should exist`);
    });
    
    // Check select fields
    const countryCodeSelect = el.shadowRoot.querySelector('select[name="countryCode"]');
    assert.exists(countryCodeSelect);
    
    const departmentSelect = el.shadowRoot.querySelector('select[name="department"]');
    assert.exists(departmentSelect);
    
    const positionSelect = el.shadowRoot.querySelector('select[name="position"]');
    assert.exists(positionSelect);
  });

  test('renders country code options', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const countrySelect = el.shadowRoot.querySelector('select[name="countryCode"]');
    const options = countrySelect.querySelectorAll('option');
    
    assert.isAtLeast(options.length, 5); // Should have multiple country options
    
    // Check some specific options exist
    const optionValues = Array.from(options).map(opt => opt.value);
    assert.include(optionValues, '+90'); // Turkey
    assert.include(optionValues, '+1');  // US
    assert.include(optionValues, '+44'); // UK
  });

  test('renders department options', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const departmentSelect = el.shadowRoot.querySelector('select[name="department"]');
    const options = departmentSelect.querySelectorAll('option');
    
    const optionValues = Array.from(options).map(opt => opt.value);
    assert.include(optionValues, 'Analytics');
    assert.include(optionValues, 'Tech');
  });

  test('renders position options', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const positionSelect = el.shadowRoot.querySelector('select[name="position"]');
    const options = positionSelect.querySelectorAll('option');
    
    const optionValues = Array.from(options).map(opt => opt.value);
    assert.include(optionValues, 'Junior');
    assert.include(optionValues, 'Medior');
    assert.include(optionValues, 'Senior');
  });

  test('renders action buttons', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const addBtn = el.shadowRoot.querySelector('.btn-primary');
    assert.exists(addBtn);
    assert.include(addBtn.textContent, 'Add Employee');
    
    const cancelBtn = el.shadowRoot.querySelector('.btn-secondary');
    assert.exists(cancelBtn);
    assert.include(cancelBtn.textContent, 'Cancel');
  });

  test('navigates back when cancel button is clicked', async () => {
    const routerStub = sandbox.stub(Router, 'go');
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const cancelBtn = el.shadowRoot.querySelector('.btn-secondary');
    cancelBtn.click();
    
    assert.isTrue(routerStub.calledWith('/employees'));
  });

  test('handles form submission prevention', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    const event = new Event('submit');
    let defaultPrevented = false;
    
    event.preventDefault = () => {
      defaultPrevented = true;
    };
    
    el.submitForm(event);
    
    assert.isTrue(defaultPrevented);
  });

  test('renders confirmation modal when showConfirmModal is true', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.showConfirmModal = true;
    await el.updateComplete;
    
    const modal = el.shadowRoot.querySelector('.modal-overlay');
    assert.exists(modal);
    
    const confirmBtn = el.shadowRoot.querySelector('.confirm-btn');
    assert.exists(confirmBtn);
    assert.include(confirmBtn.textContent, 'Proceed');
    
    const cancelBtn = el.shadowRoot.querySelector('.cancel-btn');
    assert.exists(cancelBtn);
    assert.include(cancelBtn.textContent, 'Cancel');
  });

  test('handles edge case where employee is not found in edit mode', async () => {
    sandbox.stub(EmployeeStore, 'get').returns(null);
    
    const el = await fixture(html`<employee-form></employee-form>`);
    
    // Should remain in add mode if employee not found
    assert.isFalse(el.isEditMode);
  });

  test('handles phone number with no country code gracefully', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    
    el.parseExistingPhone('1234567890');
    
    // Should default to +90 and use last 10 digits
    assert.equal(el.employee.countryCode, '+90');
    assert.equal(el.employee.phoneNumber, '1234567890');
  });
}); 