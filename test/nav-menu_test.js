import { NavMenu } from '../nav-menu.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

suite('nav-menu', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('is defined', () => {
    const el = document.createElement('nav-menu');
    assert.instanceOf(el, NavMenu);
  });

  test('renders header with logo and branding', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    const header = el.shadowRoot.querySelector('.header');
    assert.exists(header);
    
    const logo = el.shadowRoot.querySelector('.logo');
    assert.exists(logo);
    
    const logoIcon = el.shadowRoot.querySelector('.logo-icon');
    assert.exists(logoIcon);
    assert.equal(logoIcon.textContent.trim(), 'ING');
    
    const logoText = logo.querySelector('span');
    assert.exists(logoText);
    assert.equal(logoText.textContent, 'Employee Management');
  });

  test('renders navigation links', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    const navLinks = el.shadowRoot.querySelector('.nav-links');
    assert.exists(navLinks);
    
    const employeeLink = navLinks.querySelector('.nav-link');
    assert.exists(employeeLink);
    assert.include(employeeLink.textContent, 'Employees');
  });

  test('renders action buttons', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    const navActions = el.shadowRoot.querySelector('.nav-actions');
    assert.exists(navActions);
    
    const addBtn = navActions.querySelector('.add-btn');
    assert.exists(addBtn);
    assert.include(addBtn.textContent, 'Add New');
    
    const userIcon = navActions.querySelector('span[style*="color: white"]');
    assert.exists(userIcon);
    assert.equal(userIcon.textContent, '👤');
  });

  test('navigates to employees page when employee link is clicked', async () => {
    const routerSpy = sandbox.stub(Router, 'go');
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    const employeeLink = el.shadowRoot.querySelector('.nav-link');
    employeeLink.click();
    
    assert.isTrue(routerSpy.calledOnce);
    assert.isTrue(routerSpy.calledWith('/employees'));
  });

  test('navigates to add page when add button is clicked', async () => {
    const routerSpy = sandbox.stub(Router, 'go');
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    const addBtn = el.shadowRoot.querySelector('.add-btn');
    addBtn.click();
    
    assert.isTrue(routerSpy.calledOnce);
    assert.isTrue(routerSpy.calledWith('/add'));
  });

  test('navigate method calls Router.go with correct path', async () => {
    const routerSpy = sandbox.stub(Router, 'go');
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    el.navigate('/test-path');
    
    assert.isTrue(routerSpy.calledOnce);
    assert.isTrue(routerSpy.calledWith('/test-path'));
  });

  test('has proper CSS classes for styling', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    const header = el.shadowRoot.querySelector('.header');
    assert.exists(header);
    
    const logo = el.shadowRoot.querySelector('.logo');
    assert.exists(logo);
    
    const logoIcon = el.shadowRoot.querySelector('.logo-icon');
    assert.exists(logoIcon);
    
    const navLinks = el.shadowRoot.querySelector('.nav-links');
    assert.exists(navLinks);
    
    const navActions = el.shadowRoot.querySelector('.nav-actions');
    assert.exists(navActions);
    
    const addBtn = el.shadowRoot.querySelector('.add-btn');
    assert.exists(addBtn);
  });

  test('logo icon has correct styling', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    await el.updateComplete;
    
    const logoIcon = el.shadowRoot.querySelector('.logo-icon');
    const computedStyle = getComputedStyle(logoIcon);
    
    // Check if key styling properties are applied
    assert.equal(computedStyle.borderRadius, '8px');
    assert.equal(computedStyle.display, 'flex');
    assert.equal(computedStyle.alignItems, 'center');
    assert.equal(computedStyle.justifyContent, 'center');
  });

  test('button has hover effect styling', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    await el.updateComplete;
    
    const addBtn = el.shadowRoot.querySelector('.add-btn');
    const computedStyle = getComputedStyle(addBtn);
    
    // Check if transition is applied for hover effects
    assert.isNotEmpty(computedStyle.transition);
  });

  test('handles multiple navigation calls', async () => {
    const routerSpy = sandbox.stub(Router, 'go');
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    el.navigate('/path1');
    el.navigate('/path2');
    el.navigate('/path3');
    
    assert.equal(routerSpy.callCount, 3);
    assert.isTrue(routerSpy.calledWith('/path1'));
    assert.isTrue(routerSpy.calledWith('/path2'));
    assert.isTrue(routerSpy.calledWith('/path3'));
  });

  test('component structure is accessible', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    
    // Check for semantic HTML structure
    const header = el.shadowRoot.querySelector('header');
    assert.exists(header);
    
    const nav = el.shadowRoot.querySelector('nav');
    assert.exists(nav);
    
    // Links should be accessible
    const links = el.shadowRoot.querySelectorAll('.nav-link');
    links.forEach(link => {
      assert.exists(link);
    });
    
    // Button should be accessible
    const button = el.shadowRoot.querySelector('button');
    assert.exists(button);
  });
}); 