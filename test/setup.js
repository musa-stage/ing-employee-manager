/**
 * Test setup file to provide browser environment polyfills
 */

// Polyfill process for Redux toolkit compatibility
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  };
}

// Polyfill global for libraries that expect it
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
} 