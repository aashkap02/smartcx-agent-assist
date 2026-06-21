import { createContext, useContext, useEffect, useState } from "react";
import { API, store } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => store.get("scx_token") || "");
  const [user, setUser] = useState(() => {
    const u = store.get("scx_user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => { token ? store.set("scx_token", token) : store.del("scx_token"); }, [token]);
  useEffect(() => { user ? store.set("scx_user", JSON.stringify(user)) : store.del("scx_user"); }, [user]);

  async function authRequest(path, body) {
    const res = await fetch(API + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Something went wrong. Is the backend running?");
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  const signup = (name, email, password) => authRequest("/auth/signup", { name, email, password });
  const login = (email, password) => authRequest("/auth/login", { email, password });
  const logout = () => { setToken(""); setUser(null); };

  return (
    <AuthContext.Provider value={{ token, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}