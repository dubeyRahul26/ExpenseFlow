import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { jwtDecode } from "jwt-decode";
import {
  connectSocket,
  disconnectSocket
} from "../socket/socket";
import { useQueryClient } from "@tanstack/react-query";

/* ================= TYPES ================= */

interface DecodedToken {
  userId: string;
  name: string;
  email: string;
  exp: number;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  user: AuthUser | null;
  ready: boolean;
  login: (token: string) => void;
  logout: () => void;
}

/* ========================================= */

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  /* ---------- INIT (RUNS ONCE) ---------- */
  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setUser(null);
      setReady(true);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      setUser({
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email
      });

      connectSocket(token);
    } catch {
      // ❌ DO NOT call logout() here
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      disconnectSocket();
    } finally {
      // ready is set ONCE, always
      setReady(true);
    }
  }, []); // IMPORTANT: EMPTY DEPENDENCY ARRAY

  /* ---------- ACTIONS ---------- */
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    window.location.href = "/dashboard"; // intentional hard nav
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    disconnectSocket();
    queryClient.clear();
    window.location.href = "/"; // intentional hard nav
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userId: user?.id ?? null,
        ready,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ---------- HOOK ---------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }
  return ctx;
};
