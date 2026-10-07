import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin as logoutApi,
} from "../service/api";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const manualLogoutRef = useRef(false);

  const logoutAdmin = async () => {
    try {
      manualLogoutRef.current = true;
      await logoutApi();
    } catch {
      // aunque falle el backend, igual limpiamos el frontend
    } finally {
      setAdmin(null);
      setSessionExpired(false);
      sessionStorage.removeItem("admin-session-started");
    }
  };

  const login = async (email, password) => {
    manualLogoutRef.current = false;
    const currentAdmin = await loginAdmin(email, password);

    setAdmin(currentAdmin);
    setSessionExpired(false);
    sessionStorage.setItem("admin-session-started", "true");

    return currentAdmin;
  };
  useEffect(() => {
    getCurrentAdmin()
      .then((currentAdmin) => {
        setAdmin(currentAdmin);
        sessionStorage.setItem("admin-session-started", "true");
      })
      .catch(() => {
        if (manualLogoutRef.current) return;

        const hadSession =
          sessionStorage.getItem("admin-session-started") === "true";

        setAdmin(null);
        if (hadSession) setSessionExpired(true);
        sessionStorage.removeItem("admin-session-started");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkSession = () => {
      if (document.visibilityState === "hidden") return;
      if (!admin) return;

      getCurrentAdmin(true).catch(() => {
        setAdmin(null);
        setSessionExpired(true);
        sessionStorage.removeItem("admin-session-started");
      });
    };

    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkSession);

    return () => {
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkSession);
    };
  }, [admin]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (manualLogoutRef.current || !admin) return;
      setAdmin(null);
      setSessionExpired(true);
      sessionStorage.removeItem("admin-session-started");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [admin]);

  const value = useMemo(
    () => ({
      admin,
      loading,
      login,
      logoutAdmin,
      setAdmin,
      sessionExpired,
      setSessionExpired,
    }),
    [admin, loading, sessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
