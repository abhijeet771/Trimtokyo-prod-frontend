
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import {
  getCurrentUser,
  logoutUser,
  saveFCMToken,
} from "../services/auth.service";

import { getFCMToken } from "../utils/notification";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getCurrentUser();
      const currentUser = res.data?.data;

      if (!currentUser) {
        setUser(null);
        return null;
      }

      setUser(currentUser);

      // FCM registration is optional; it must not invalidate login.
      try {
        const token = await getFCMToken();

        if (token) {
          await saveFCMToken(token);
        }
      } catch (err) {
        console.error("FCM token save failed:", err);
      }

      return currentUser;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      queryClient.clear();
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
};
