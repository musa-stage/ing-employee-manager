// employee-list.js
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { t } from './locales.js';
import { EmployeeStore } from './employee-store.js';
import { Router } from '@vaadin/router';
import './nav-menu.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    searchTerm: { type: String },
    viewMode: { type: String },
    currentPage: { type: Number },
    showDeleteModal: { type: Boolean },
    employeeToDelete: { type: Object },
  };

  constructor() {
    super();
    this.employees = [];
    this.searchTerm = '';
    this.viewMode = 'table';
    this.currentPage = 1;
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.employees = EmployeeStore.getAll();
    EmployeeStore.subscribe(() => {
      this.employees = EmployeeStore.getAll();
    });
  }

  static styles = css`
    .container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ff6200;
      margin-bottom: 1rem;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-container {
      position: relative;
      flex: 1;
      max-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
      background: #f9f9f9;
    }

    .search-input:focus {
      outline: none;
      border-color: #ff6200;
      background: white;
    }

    .view-toggles {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .toggle-btn {
      padding: 0.5rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 1.2rem;
      transition: all 0.2s;
    }

    .toggle-btn.active {
      background: #ff6200;
      color: white;
      border-color: #ff6200;
    }

    .toggle-btn:hover {
      background: #f0f0f0;
    }

    .toggle-btn.active:hover {
      background: #e55500;
    }

    .content {
      padding: 0;
    }

    .table-container {
      overflow-x: auto;
      overflow-y: visible;
      width: 100%;
      position: relative;
    }

    .table-container::-webkit-scrollbar {
      height: 8px;
    }

    .table-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .table-container::-webkit-scrollbar-thumb {
      background: #ff6200;
      border-radius: 4px;
    }

    .table-container::-webkit-scrollbar-thumb:hover {
      background: #e55500;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      min-width: 800px; /* Ensures table doesn't shrink too much */
    }

    thead th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #ff6200;
      border-bottom: 2px solid #e0e0e0;
      white-space: nowrap;
    }

    tbody td {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }

    tbody tr:hover {
      background: #f8f9fa;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.25rem 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .edit-btn {
      background: #007bff;
      color: white;
    }

    .edit-btn:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }

    .delete-btn {
      background: #dc3545;
      color: white;
    }

    .delete-btn:hover {
      background: #c82333;
      transform: translateY(-1px);
    }

    .pagination {
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
    }

    .page-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .page-btn:hover {
      background: #f0f0f0;
    }

    .page-btn.active {
      background: #ff6200;
      color: white;
      border-color: #ff6200;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-ellipsis {
      padding: 0.5rem 0.25rem;
      color: #666;
      font-size: 0.9rem;
    }

    .pagination-info {
      margin-left: 1rem;
      color: #666;
      font-size: 0.85rem;
      white-space: nowrap;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .modal-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #ff6200;
      margin-bottom: 1rem;
    }

    .modal-message {
      margin-bottom: 1.5rem;
      color: #666;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .modal-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .cancel-btn {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    .cancel-btn:hover {
      background: #e9ecef;
    }

    .confirm-btn {
      background: #ff6200;
      color: white;
    }

    .confirm-btn:hover {
      background: #e55500;
    }

    @media (max-width: 768px) {
      .controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        max-width: none;
      }

      .table-container {
        overflow-x: visible;
      }

      table {
        min-width: unset;
      }

      table, thead, tbody, th, td, tr {
        display: block;
      }

      thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }

      tr {
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        background: white;
      }

      td {
        border: none;
        padding: 0.5rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      td:before {
        content: attr(data-label);
        font-weight: 600;
        color: #ff6200;
      }

      .actions {
        justify-content: flex-end;
        margin-top: 0.5rem;
      }

      .pagination {
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .pagination-info {
        width: 100%;
        text-align: center;
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `;

  updateSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
    this.currentPage = 1;
  }

  toggleView(mode) {
    this.viewMode = mode;
  }

  confirmDelete(employee) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  deleteRecord() {
    if (this.employeeToDelete) {
      EmployeeStore.delete(this.employeeToDelete.id);
      this.showDeleteModal = false;
      this.employeeToDelete = null;
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  editRecord(id) {
    Router.go(`/edit/${id}`);
  }

  get filteredEmployees() {
    return this.employees.filter(emp =>
      Object.values(emp).some(val => 
        val.toString().toLowerCase().includes(this.searchTerm)
      )
    );
  }

  get paginatedEmployees() {
    const itemsPerPage = 10;
    const start = (this.currentPage - 1) * itemsPerPage;
    return this.filteredEmployees.slice(start, start + itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / 10);
  }

  changePage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  renderTableView() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${t('firstName')}</th>
              <th>${t('lastName')}</th>
              <th>${t('doe')}</th>
              <th>${t('dob')}</th>
              <th>${t('phone')}</th>
              <th>${t('email')}</th>
              <th>${t('department')}</th>
              <th>${t('position')}</th>
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${repeat(this.paginatedEmployees, (e) => e.id, (emp) => html`
              <tr>
                <td data-label="${t('firstName')}">${emp.firstName}</td>
                <td data-label="${t('lastName')}">${emp.lastName}</td>
                <td data-label="${t('doe')}">${emp.doe}</td>
                <td data-label="${t('dob')}">${emp.dob}</td>
                <td data-label="${t('phone')}">${emp.phone}</td>
                <td data-label="${t('email')}">${emp.email}</td>
                <td data-label="${t('department')}">${emp.department}</td>
                <td data-label="${t('position')}">${emp.position}</td>
                <td data-label="${t('actions')}" class="actions">
                  <button class="action-btn edit-btn" @click="${() => this.editRecord(emp.id)}">✏️</button>
                  <button class="action-btn delete-btn" @click="${() => this.confirmDelete(emp)}">🗑️</button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  renderListView() {
    return html`
      <div style="padding: 1rem;">
        ${repeat(this.paginatedEmployees, (e) => e.id, (emp) => html`
          <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: white;">
            <h3 style="color: #ff6200; margin-bottom: 0.5rem;">${emp.firstName} ${emp.lastName}</h3>
            <p><strong>Email:</strong> ${emp.email}</p>
            <p><strong>Department:</strong> ${emp.department}</p>
            <p><strong>Position:</strong> ${emp.position}</p>
            <p><strong>Phone:</strong> ${emp.phone}</p>
            <div class="actions" style="margin-top: 1rem;">
              <button class="action-btn edit-btn" @click="${() => this.editRecord(emp.id)}">✏️ ${t('edit')}</button>
              <button class="action-btn delete-btn" @click="${() => this.confirmDelete(emp)}">🗑️ ${t('delete')}</button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderPagination() {
    if (this.totalPages <= 1) return '';

    const generatePageNumbers = () => {
      const pages = [];
      const currentPage = this.currentPage;
      const totalPages = this.totalPages;
      
      if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        if (currentPage > 4) {
          pages.push('...');
        }
        
        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== totalPages) {
            pages.push(i);
          }
        }
        
        if (currentPage < totalPages - 3) {
          pages.push('...');
        }
        
        // Always show last page
        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    const pages = generatePageNumbers();

    return html`
      <div class="pagination">
        <button 
          class="page-btn" 
          ?disabled="${this.currentPage === 1}"
          @click="${() => this.changePage(this.currentPage - 1)}"
          title="Previous page"
        >
          ‹
        </button>
        
        ${pages.map(page => {
          if (page === '...') {
            return html`<span class="pagination-ellipsis">...</span>`;
          }
          return html`
            <button 
              class="page-btn ${this.currentPage === page ? 'active' : ''}"
              @click="${() => this.changePage(page)}"
              title="Page ${page}"
            >
              ${page}
            </button>
          `;
        })}
        
        <button 
          class="page-btn" 
          ?disabled="${this.currentPage === this.totalPages}"
          @click="${() => this.changePage(this.currentPage + 1)}"
          title="Next page"
        >
          ›
        </button>
        
        <div class="pagination-info">
          Page ${this.currentPage} of ${this.totalPages} (${this.filteredEmployees.length} employees)
        </div>
      </div>
    `;
  }

  renderDeleteModal() {
    if (!this.showDeleteModal || !this.employeeToDelete) return '';

    return html`
      <div class="modal-overlay" @click="${this.cancelDelete}">
        <div class="modal" @click="${(e) => e.stopPropagation()}">
          <div class="modal-title">Are you sure?</div>
          <div class="modal-message">
            Selected Employee record of ${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName} will be deleted
          </div>
          <div class="modal-actions">
            <button class="modal-btn cancel-btn" @click="${this.cancelDelete}">Cancel</button>
            <button class="modal-btn confirm-btn" @click="${this.deleteRecord}">Proceed</button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <nav-menu></nav-menu>
      <div class="container">
        <div class="header">
          <h1 class="title">Employee List</h1>
          <div class="controls">
            <div class="search-container">
              <input 
                type="text" 
                class="search-input"
                placeholder="${t('search')}..." 
                @input="${this.updateSearch}" 
                .value="${this.searchTerm}"
              />
            </div>
            <div class="view-toggles">
              <button 
                class="toggle-btn ${this.viewMode === 'table' ? 'active' : ''}" 
                @click="${() => this.toggleView('table')}"
                title="Table View"
              >
                ☰
              </button>
              <button 
                class="toggle-btn ${this.viewMode === 'list' ? 'active' : ''}" 
                @click="${() => this.toggleView('list')}"
                title="List View"
              >
                ▦
              </button>
            </div>
          </div>
        </div>
        <div class="content">
          ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}
        </div>
        ${this.renderPagination()}
      </div>
      ${this.renderDeleteModal()}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
