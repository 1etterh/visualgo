// src/shims-pyodide.d.ts
declare global {
    interface Window {
      loadPyodide: () => Promise<any>;
    }
  }
  export {};
  