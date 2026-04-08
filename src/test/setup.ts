import "@testing-library/jest-dom";

const storageState = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageState.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storageState.set(key, String(value));
  },
  removeItem: (key: string) => {
    storageState.delete(key);
  },
  clear: () => {
    storageState.clear();
  },
  key: (index: number) => Array.from(storageState.keys())[index] ?? null,
  get length() {
    return storageState.size;
  },
};

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: mockLocalStorage,
});

Object.defineProperty(globalThis, "localStorage", {
  writable: true,
  value: mockLocalStorage,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
