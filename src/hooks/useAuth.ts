import { useEffect, useState, useCallback } from "react";

interface AuthStatus {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  isTokenValid: boolean;
}

export function useAuth(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isLoggedIn: false,
    username: null,
    token: null,
    isTokenValid: false,
  });

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    let username: string | null = null;
    if (user) {
      try {
        const userData = JSON.parse(user);
        username = userData.username || null;
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    const isLoggedIn = !!token && !!username;
    const isTokenValid = isLoggedIn; // Token validation could be more complex

    setAuthStatus({
      isLoggedIn,
      username,
      token,
      isTokenValid,
    });

    // Log status for debugging
    if (isLoggedIn) {
      console.log("[useAuth] Authenticated:", {
        username,
        tokenExists: !!token,
      });
    } else {
      console.warn("[useAuth] Not authenticated");
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for storage changes
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [checkAuth]);

  return authStatus;
}
