import { useEffect, useMemo, useState } from 'react';
import { getCurrentAdmin, loginAdmin } from '../service/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [hasAuthenticatedAdmin, setHasAuthenticatedAdmin] = useState(
    () => sessionStorage.getItem('admin-session-started') === 'true'
  );
  const login = async (email, password) => {
    const currentAdmin = await loginAdmin(email, password);

    setAdmin(currentAdmin);
    setHasAuthenticatedAdmin(true);
    setSessionExpired(false);
    sessionStorage.setItem('admin-session-started', 'true');

    return currentAdmin;
  };

  useEffect(() => {
    getCurrentAdmin()
      .then((currentAdmin) => {
        setAdmin(currentAdmin);
        setHasAuthenticatedAdmin(true);
        sessionStorage.setItem('admin-session-started', 'true');
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkSession = () => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      if (!hasAuthenticatedAdmin) {
        return;
      }

      getCurrentAdmin(true).catch(() => {});
    };

    window.addEventListener('focus', checkSession);
    document.addEventListener('visibilitychange', checkSession);

    return () => {
      window.removeEventListener('focus', checkSession);
      document.removeEventListener('visibilitychange', checkSession);
    };
  }, [hasAuthenticatedAdmin]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setAdmin(null);
      setSessionExpired(true);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const value = useMemo(
    () => ({ admin, loading, login, setAdmin, sessionExpired, setSessionExpired }),
    [admin, loading, login, sessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
