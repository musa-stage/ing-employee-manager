import { EmployeeList } from '../employee-list.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { EmployeeStore } from '../employee-store.js';
import { Router } from '@vaadin/router';

suite('employee-list', () => {
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
      },
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@ing.com',
        phone: '+(90) 555-111-2222',
        dob: '1992-12-25',
        doe: '2023-01-15',
        department: 'Tech',
        position: 'Junior'
      }
    ];
  });

  teardown(() => {
    sandbox.restore();
  });

  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('initializes with default properties', async () => {
    // Clear any existing employees first
    const existingEmployees = EmployeeStore.getAll();
    existingEmployees.forEach(emp => EmployeeStore.delete(emp.id));
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    assert.isArray(el.employees);
    assert.equal(el.employees.length, 0);
    assert.equal(el.searchTerm, '');
    assert.equal(el.viewMode, 'table');
    assert.equal(el.currentPage, 1);
    assert.isFalse(el.showDeleteModal);
    assert.isNull(el.employeeToDelete);
  });

  test('loads employees on connectedCallback', async () => {
    const getAllStub = sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    const subscribeStub = sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    assert.isTrue(getAllStub.calledOnce);
    assert.isTrue(subscribeStub.calledOnce);
    assert.deepEqual(el.employees, mockEmployees);
  });

  test('renders header with title and controls', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const title = el.shadowRoot.querySelector('.title');
    assert.exists(title);
    assert.include(title.textContent, 'Employee List');
    
    const controls = el.shadowRoot.querySelector('.controls');
    assert.exists(controls);
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    assert.exists(searchInput);
    
    const viewToggles = el.shadowRoot.querySelector('.view-toggles');
    assert.exists(viewToggles);
  });

  test('renders table view by default', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const table = el.shadowRoot.querySelector('table');
    assert.exists(table);
    
    const thead = table.querySelector('thead');
    assert.exists(thead);
    
    const tbody = table.querySelector('tbody');
    assert.exists(tbody);
  });

  test('displays employees in table rows', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, mockEmployees.length);
    
    // Check first row data - it shows firstName and lastName separately
    const firstRowCells = rows[0].querySelectorAll('td');
    assert.include(firstRowCells[0].textContent, 'John');
    assert.include(firstRowCells[1].textContent, 'Doe');
    assert.include(firstRowCells[4].textContent, '+(90) 555-123-4567');
    assert.include(firstRowCells[5].textContent, 'john.doe@ing.com');
  });

  test('toggles between table and list view', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Initially in table view
    assert.equal(el.viewMode, 'table');
    let table = el.shadowRoot.querySelector('table');
    assert.exists(table);
    
    // Toggle to list view
    const listToggle = el.shadowRoot.querySelector('.toggle-btn[title="List View"]');
    listToggle.click();
    await el.updateComplete;
    
    assert.equal(el.viewMode, 'list');
    table = el.shadowRoot.querySelector('table');
    assert.isNull(table);
    
    // In list view, items are rendered as divs with employee names
    const listContainer = el.shadowRoot.querySelector('div[style*="padding: 1rem"]');
    assert.exists(listContainer);
  });

  test('filters employees based on search term', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const searchInput = el.shadowRoot.querySelector('.search-input');
    
    // Search for "john"
    searchInput.value = 'john';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    assert.equal(el.searchTerm, 'john');
    
    const filteredEmployees = el.filteredEmployees;
    assert.equal(filteredEmployees.length, 2); // John Doe and Bob Johnson both match
  });

  test('searches across multiple fields', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Search by email - should find jane.smith
    el.searchTerm = 'jane.smith';
    await el.updateComplete;
    let results = el.filteredEmployees;
    assert.equal(results.length, 1);
    assert.equal(results[0].email, 'jane.smith@ing.com');
    
    // Search by department - should find Tech employees
    el.searchTerm = 'tech';
    await el.updateComplete;
    results = el.filteredEmployees;
    assert.equal(results.length, 2);
    
    // Search by position - should find Senior employee
    el.searchTerm = 'senior';
    await el.updateComplete;
    results = el.filteredEmployees;
    assert.equal(results.length, 1);
    assert.equal(results[0].position, 'Senior');
  });

  test('search is case insensitive', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Search for 'john' in lowercase - should find John Doe and Bob Johnson (contains 'john' in email)
    el.searchTerm = 'john';
    await el.updateComplete;
    const results = el.filteredEmployees;
    
    assert.isAtLeast(results.length, 1); // At least John Doe should be found
  });

  test('handles pagination correctly', async () => {
    // Create many employees to test pagination
    const manyEmployees = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      firstName: `Employee${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `emp${i + 1}@ing.com`,
      phone: `+(90) 555-${String(i + 1).padStart(3, '0')}-0000`,
      department: 'Analytics',
      position: 'Junior'
    }));
    
    sandbox.stub(EmployeeStore, 'getAll').returns(manyEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Should show first 10 items by default
    const paginatedEmployees = el.paginatedEmployees;
    assert.equal(paginatedEmployees.length, 10);
    assert.equal(paginatedEmployees[0].firstName, 'Employee1');
    
    // Should calculate correct total pages
    const totalPages = el.totalPages;
    assert.equal(totalPages, 3); // 25 items / 10 per page = 3 pages
  });

  test('changes pages correctly', async () => {
    const manyEmployees = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      firstName: `Employee${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `emp${i + 1}@ing.com`,
      department: 'Analytics'
    }));
    
    sandbox.stub(EmployeeStore, 'getAll').returns(manyEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Go to page 2
    el.changePage(2);
    await el.updateComplete;
    
    assert.equal(el.currentPage, 2);
    const paginatedEmployees = el.paginatedEmployees;
    assert.equal(paginatedEmployees[0].firstName, 'Employee11');
  });

  test('shows delete confirmation modal', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    el.confirmDelete(mockEmployees[0]);
    await el.updateComplete;
    
    assert.isTrue(el.showDeleteModal);
    assert.equal(el.employeeToDelete, mockEmployees[0]);
    
    const modal = el.shadowRoot.querySelector('.modal-overlay');
    assert.exists(modal);
  });

  test('deletes employee when confirmed', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    const deleteStub = sandbox.stub(EmployeeStore, 'delete');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    el.employeeToDelete = mockEmployees[0];
    
    el.deleteRecord();
    
    assert.isTrue(deleteStub.calledOnce);
    assert.isTrue(deleteStub.calledWith('1'));
    assert.isFalse(el.showDeleteModal);
    assert.isNull(el.employeeToDelete);
  });

  test('cancels delete operation', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    el.showDeleteModal = true;
    el.employeeToDelete = mockEmployees[0];
    
    el.cancelDelete();
    
    assert.isFalse(el.showDeleteModal);
    assert.isNull(el.employeeToDelete);
  });

  test('navigates to edit page', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    const routerStub = sandbox.stub(Router, 'go');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    el.editRecord('1');
    
    assert.isTrue(routerStub.calledOnce);
    assert.isTrue(routerStub.calledWith('/edit/1'));
  });

  test('renders action buttons in table view', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const editBtns = el.shadowRoot.querySelectorAll('.edit-btn');
    const deleteBtns = el.shadowRoot.querySelectorAll('.delete-btn');
    
    assert.equal(editBtns.length, mockEmployees.length);
    assert.equal(deleteBtns.length, mockEmployees.length);
  });

  test('renders action buttons in list view', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Switch to list view
    el.toggleView('list');
    await el.updateComplete;
    
    const editBtns = el.shadowRoot.querySelectorAll('.edit-btn');
    const deleteBtns = el.shadowRoot.querySelectorAll('.delete-btn');
    
    assert.equal(editBtns.length, mockEmployees.length);
    assert.equal(deleteBtns.length, mockEmployees.length);
  });

  test('handles empty employee list', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns([]);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    assert.equal(el.employees.length, 0);
    assert.equal(el.filteredEmployees.length, 0);
    assert.equal(el.paginatedEmployees.length, 0);
    assert.equal(el.totalPages, 0);
  });

  test('updates employee list when store changes', async () => {
    const getAllStub = sandbox.stub(EmployeeStore, 'getAll').returns([]);
    let storeCallback;
    sandbox.stub(EmployeeStore, 'subscribe').callsFake((cb) => {
      storeCallback = cb;
    });
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Initially empty
    assert.equal(el.employees.length, 0);
    
    // Simulate store update
    getAllStub.returns(mockEmployees);
    storeCallback();
    
    assert.deepEqual(el.employees, mockEmployees);
  });

  test('pagination shows correct page numbers', async () => {
    const manyEmployees = Array.from({ length: 35 }, (_, i) => ({
      id: `${i + 1}`,
      firstName: `Employee${i + 1}`,
      lastName: `Last${i + 1}`,
      email: `emp${i + 1}@ing.com`
    }));
    
    sandbox.stub(EmployeeStore, 'getAll').returns(manyEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
    
    // Should have pagination for 35 employees
    assert.equal(el.totalPages, 4); // 35 / 10 = 4 pages
    
    const pagination = el.shadowRoot.querySelector('.pagination');
    assert.exists(pagination);
    
    const pageButtons = el.shadowRoot.querySelectorAll('.page-btn');
    assert.isAtLeast(pageButtons.length, 2); // At least prev/next buttons
  });

  test('active view toggle has correct styling class', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const tableToggle = el.shadowRoot.querySelector('.toggle-btn[title="Table View"]');
    const listToggle = el.shadowRoot.querySelector('.toggle-btn[title="List View"]');
    
    // Table view should be active by default
    assert.isTrue(tableToggle.classList.contains('active'));
    assert.isFalse(listToggle.classList.contains('active'));
    
    // Switch to list view
    listToggle.click();
    await el.updateComplete;
    
    assert.isFalse(tableToggle.classList.contains('active'));
    assert.isTrue(listToggle.classList.contains('active'));
  });

  test('handles employees with missing fields gracefully', async () => {
    const incompleteEmployees = [
      {
        id: '1',
        firstName: 'John',
        // Missing lastName
        email: 'john@ing.com'
      }
    ];
    
    sandbox.stub(EmployeeStore, 'getAll').returns(incompleteEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    // Should render without errors
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    assert.equal(rows.length, 1);
  });

  test('renders nav-menu component', async () => {
    sandbox.stub(EmployeeStore, 'getAll').returns(mockEmployees);
    sandbox.stub(EmployeeStore, 'subscribe');
    
    const el = await fixture(html`<employee-list></employee-list>`);
    
    const navMenu = el.shadowRoot.querySelector('nav-menu');
    assert.exists(navMenu);
  });
}); 