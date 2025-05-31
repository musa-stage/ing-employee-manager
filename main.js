// main.js (entry point)
// Fix for Redux Toolkit in browser environment
if (typeof process === 'undefined') {
  window.process = { env: { NODE_ENV: 'development' } };
}

import { store } from './redux/store.js'; // Initialize Redux store
import './employee-list.js';
import './employee-form.js';
import './nav-menu.js';
import { Router } from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);
window.router = router;

// Make store available globally for debugging
window.__REDUX_STORE__ = store;

router.setRoutes([
  { path: '/', redirect: '/employees' },
  { path: '/employees', component: 'employee-list' },
  { path: '/add', component: 'employee-form' },
  { path: '/edit/:id', component: 'employee-form' },
]);
