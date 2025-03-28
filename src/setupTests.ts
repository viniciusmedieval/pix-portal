
import '@testing-library/jest-dom';

// Mock the window.matchMedia function for tests
// This is needed for some UI components that use media queries
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {
      return true;
    },
  };
};

// Mock Intersection Observer
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
};

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Suppress console errors in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (
      args[0].includes('React does not recognize the') ||
      args[0].includes('Warning:')
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};
