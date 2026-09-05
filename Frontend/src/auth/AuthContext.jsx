import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "vaultline_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const value = useMemo(() => {
    function saveAuth(next) {
      setAuth(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }

    function logout() {
      setAuth(null);
      localStorage.removeItem(STORAGE_KEY);
    }

    return {
      token: auth?.token || null,
      user: auth
        ? { id: auth.id, username: auth.username, email: auth.email }
        : null,
      saveAuth,
      logout,
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
