export const API = import.meta.env.VITE_API_URL || "";

// localStorage that won't crash if the browser blocks it (e.g. in a sandbox)
export const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};