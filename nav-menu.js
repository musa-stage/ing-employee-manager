// nav-menu.js
import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

export class NavMenu extends LitElement {
  static styles = css`
    .header {
      background: linear-gradient(135deg, #ff6200, #ff8533);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .logo-icon {
      background: white;
      color: #ff6200;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .add-btn {
      background: white;
      color: #ff6200;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .add-btn:hover {
      background: #f0f0f0;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-links {
        flex-direction: column;
        gap: 0.5rem;
      }

      .nav-actions {
        gap: 0.5rem;
      }
    }
  `;

  navigate(path) {
    Router.go(path);
  }

  render() {
    return html`
      <header class="header">
        <div class="logo">
          <div class="logo-icon">ING</div>
          <span>Employee Management</span>
        </div>
        <nav class="nav-links">
          <a class="nav-link" @click=${() => this.navigate('/employees')}>🏠 Employees</a>
        </nav>
        <div class="nav-actions">
          <button class="add-btn" @click=${() => this.navigate('/add')}>+ Add New</button>
          <span style="color: white;">👤</span>
        </div>
      </header>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
