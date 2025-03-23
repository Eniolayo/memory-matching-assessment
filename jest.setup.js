import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }) => {
    return (
      <img src={src || "/placeholder.svg"} alt={alt} className={className} />
    );
  },
}));

// Mock localStorage
class LocalStorageMock {
  store = {};

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});
