import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAdmin } from "../service/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentAdmin()
      .then((currentAdmin) => {
        setAdmin(currentAdmin);
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}