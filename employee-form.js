// employee-form.js
import { LitElement, html, css } from 'lit';
import { t } from './locales.js';
import { EmployeeStore } from './employee-store.js';
import { Router } from '@vaadin/router';
import './nav-menu.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    isEditMode: { type: Boolean },
    showConfirmModal: { type: Boolean },
  };

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+90',
      phoneNumber: '',
      dob: '',
      doe: '',
      department: 'Analytics',
      position: 'Junior'
    };
    this.isEditMode = false;
    this.showConfirmModal = false;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Check URL for employee ID parameter (from /edit/:id route)
    const currentPath = window.location.pathname;
    const editMatch = currentPath.match(/^\/edit\/(.+)$/);
    
    if (editMatch && editMatch[1]) {
      const employeeId = editMatch[1];
      const existing = EmployeeStore.get(employeeId);
      if (existing) {
        this.employee = { ...existing };
        this.isEditMode = true;
        
        // Parse existing phone number if it exists
        if (existing.phone) {
          this.parseExistingPhone(existing.phone);
        }
      }
    }
  }

  parseExistingPhone(phone) {
    // Extract country code and phone number from formatted phone
    const phoneStr = phone.toString();
    
    if (phoneStr.startsWith('+(90)')) {
      this.employee.countryCode = '+90';
      const numbers = phoneStr.replace(/[^\d]/g, '').slice(2); // Remove country code digits
      this.employee.phoneNumber = numbers;
    } else if (phoneStr.startsWith('+1')) {
      this.employee.countryCode = '+1';
      const numbers = phoneStr.replace(/[^\d]/g, '').slice(1); // Remove country code digit
      this.employee.phoneNumber = numbers;
    } else if (phoneStr.startsWith('+44')) {
      this.employee.countryCode = '+44';
      const numbers = phoneStr.replace(/[^\d]/g, '').slice(2); // Remove country code digits
      this.employee.phoneNumber = numbers;
    } else if (phoneStr.startsWith('+49')) {
      this.employee.countryCode = '+49';
      const numbers = phoneStr.replace(/[^\d]/g, '').slice(2); // Remove country code digits
      this.employee.phoneNumber = numbers;
    } else if (phoneStr.startsWith('+33')) {
      this.employee.countryCode = '+33';
      const numbers = phoneStr.replace(/[^\d]/g, '').slice(2); // Remove country code digits
      this.employee.phoneNumber = numbers;
    } else {
      // Fallback - try to extract numbers
      this.employee.countryCode = '+90';
      this.employee.phoneNumber = phoneStr.replace(/[^\d]/g, '').slice(-10); // Last 10 digits
    }
  }

  static styles = css`
    .container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      max-width: 600px;
      margin: 0 auto;
    }

    .header {
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
    }

    .title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ff6200;
      margin: 0;
    }

    .form-content {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .phone-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1rem;
      grid-column: 1 / -1;
    }

    .phone-group {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    input, select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
      background: #f9f9f9;
      transition: all 0.2s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #ff6200;
      background: white;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s;
      min-width: 100px;
    }

    .btn-primary {
      background: #ff6200;
      color: white;
    }

    .btn-primary:hover {
      background: #e55500;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background: #e9ecef;
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
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .phone-container {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }

      .container {
        margin: 0 1rem;
      }
    }
  `;

  updateField(e) {
    const { name, value } = e.target;
    
    // Validate phone number input to only allow digits and max 10 characters
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        this.employee = { ...this.employee, [name]: digitsOnly };
      }
      return;
    }
    
    this.employee = { ...this.employee, [name]: value };
  }

  formatPhoneNumber(countryCode, phoneNumber) {
    if (phoneNumber.length !== 10) {
      return `${countryCode} ${phoneNumber}`;
    }
    
    // Format based on country code
    if (countryCode === '+90') {
      // Turkish format: +(90) 532 123 45 67
      return `+(90) ${phoneNumber.slice(0,3)} ${phoneNumber.slice(3,6)} ${phoneNumber.slice(6,8)} ${phoneNumber.slice(8,10)}`;
    } else if (countryCode === '+1') {
      // US/Canada format: +1 (555) 555-5555
      return `+1 (${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}`;
    } else if (countryCode === '+44') {
      // UK format: +44 7700 900123
      return `+44 ${phoneNumber.slice(0,4)} ${phoneNumber.slice(4,10)}`;
    } else if (countryCode === '+49') {
      // German format: +49 176 12345678
      return `+49 ${phoneNumber.slice(0,3)} ${phoneNumber.slice(3,10)}`;
    } else if (countryCode === '+33') {
      // French format: +33 6 12 34 56 78
      return `+33 ${phoneNumber.slice(0,1)} ${phoneNumber.slice(1,3)} ${phoneNumber.slice(3,5)} ${phoneNumber.slice(5,7)} ${phoneNumber.slice(7,9)}`;
    }
    
    // Default format
    return `${countryCode} ${phoneNumber}`;
  }

  submitForm(e) {
    e.preventDefault();
    if (!this.employee.email || !this.employee.firstName || !this.employee.lastName) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (this.employee.phoneNumber.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }
    
    if (this.isEditMode) {
      this.showConfirmModal = true;
    } else {
      this.saveEmployee();
    }
  }

  saveEmployee() {
    // Format the phone number before saving
    const formattedEmployee = {
      ...this.employee,
      phone: this.formatPhoneNumber(this.employee.countryCode, this.employee.phoneNumber)
    };
    
    // Remove the separate countryCode and phoneNumber fields
    delete formattedEmployee.countryCode;
    delete formattedEmployee.phoneNumber;
    
    if (this.isEditMode) {
      EmployeeStore.update(formattedEmployee.id, formattedEmployee);
    } else {
      EmployeeStore.add(formattedEmployee);
    }
    Router.go('/employees');
  }

  confirmUpdate() {
    this.showConfirmModal = false;
    this.saveEmployee();
  }

  cancelUpdate() {
    this.showConfirmModal = false;
  }

  renderConfirmModal() {
    if (!this.showConfirmModal) return '';

    return html`
      <div class="modal-overlay" @click="${this.cancelUpdate}">
        <div class="modal" @click="${(e) => e.stopPropagation()}">
          <div class="modal-title">Confirm Update</div>
          <div class="modal-message">
            Are you sure you want to update the employee record for ${this.employee.firstName} ${this.employee.lastName}?
          </div>
          <div class="modal-actions">
            <button class="modal-btn cancel-btn" @click="${this.cancelUpdate}">Cancel</button>
            <button class="modal-btn confirm-btn" @click="${this.confirmUpdate}">Proceed</button>
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
          <h1 class="title">${this.isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
        </div>
        <div class="form-content">
          <form @submit="${this.submitForm}">
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">${t('firstName')} *</label>
                <input 
                  id="firstName"
                  name="firstName" 
                  .value="${this.employee.firstName}" 
                  @input="${this.updateField}" 
                  required 
                  placeholder="Enter first name"
                />
              </div>
              
              <div class="form-group">
                <label for="lastName">${t('lastName')} *</label>
                <input 
                  id="lastName"
                  name="lastName" 
                  .value="${this.employee.lastName}" 
                  @input="${this.updateField}" 
                  required 
                  placeholder="Enter last name"
                />
              </div>
              
              <div class="form-group">
                <label for="dob">${t('dob')} *</label>
                <input 
                  id="dob"
                  name="dob" 
                  type="date" 
                  .value="${this.employee.dob}" 
                  @input="${this.updateField}" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="doe">${t('doe')} *</label>
                <input 
                  id="doe"
                  name="doe" 
                  type="date" 
                  .value="${this.employee.doe}" 
                  @input="${this.updateField}" 
                  required 
                />
              </div>
              
              <div class="phone-container">
                <div class="phone-group">
                  <label for="countryCode">${t('countryCode')} *</label>
                  <select 
                    id="countryCode"
                    name="countryCode" 
                    .value="${this.employee.countryCode}" 
                    @change="${this.updateField}"
                  >
                    <option value="+90">🇹🇷 +90 (Turkey)</option>
                    <option value="+1">🇺🇸 +1 (USA/Canada)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+49">🇩🇪 +49 (Germany)</option>
                    <option value="+33">🇫🇷 +33 (France)</option>
                  </select>
                </div>
                
                <div class="phone-group">
                  <label for="phoneNumber">${t('phoneNumber')} *</label>
                  <input 
                    id="phoneNumber"
                    name="phoneNumber" 
                    type="tel"
                    .value="${this.employee.phoneNumber}" 
                    @input="${this.updateField}" 
                    required 
                    placeholder="5555555555"
                    maxlength="10"
                    pattern="[0-9]{10}"
                    title="Please enter exactly 10 digits"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">${t('email')} *</label>
                <input 
                  id="email"
                  name="email" 
                  type="email" 
                  .value="${this.employee.email}" 
                  @input="${this.updateField}" 
                  required 
                  placeholder="employee@company.com"
                />
              </div>
              
              <div class="form-group">
                <label for="department">${t('department')} *</label>
                <select 
                  id="department"
                  name="department" 
                  .value="${this.employee.department}" 
                  @change="${this.updateField}"
                >
                  <option value="Analytics">Analytics</option>
                  <option value="Tech">Tech</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="position">${t('position')} *</label>
                <select 
                  id="position"
                  name="position" 
                  .value="${this.employee.position}" 
                  @change="${this.updateField}"
                >
                  <option value="Junior">Junior</option>
                  <option value="Medior">Medior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="${() => Router.go('/employees')}">
                ${t('cancel')}
              </button>
              <button type="submit" class="btn btn-primary">
                ${this.isEditMode ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
      ${this.renderConfirmModal()}
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
