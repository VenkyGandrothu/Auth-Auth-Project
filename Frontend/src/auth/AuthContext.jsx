import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe } from "../api/authApi.js";

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

function writeStoredAuth(next) {
  if (next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const [roleReady, setRoleReady] = useState(() => {
    const stored = readStoredAuth();
    return !stored?.token || Boolean(stored.role);
  });

  // Login returns a token, but the role lives on the existing profile call.
  // If a saved session has no role yet, load it once so route guards can decide.
  useEffect(() => {
    if (!auth?.token || auth.role) {
      setRoleReady(true);
      return undefined;
    }

    let active = true;
    setRoleReady(false);

    getMe(auth.token)
      .then((me) => {
        if (!active) {
          return;
        }
        const next = {
          ...auth,
          id: me.id ?? auth.id,
          username: me.username ?? auth.username,
          email: me.email ?? auth.email,
          role: me.role || "USER",
          status: me.status,
        };
        writeStoredAuth(next);
        setAuth(next);
        setRoleReady(true);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        writeStoredAuth(null);
        setAuth(null);
        setRoleReady(true);
      });

    return () => {
      active = false;
    };
  }, [auth]);

  const value = useMemo(() => {
    function saveAuth(next) {
      writeStoredAuth(next);
      setAuth(next);
      setRoleReady(!next?.token || Boolean(next?.role));
    }

    function logout() {
      writeStoredAuth(null);
      setAuth(null);
      setRoleReady(true);
    }

    return {
      token: auth?.token || null,
      roleReady,
      user: auth
        ? {
            id: auth.id,
            username: auth.username,
            email: auth.email,
            role: auth.role || null,
            status: auth.status || null,
          }
        : null,
      saveAuth,
      logout,
    };
  }, [auth, roleReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
