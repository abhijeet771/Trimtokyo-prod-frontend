import React, {  createContext,  useContext,  useEffect,  useState,} from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { getFCMToken } from "../utils/notification";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get(
        "/api/v1/auth/me",
        {
          withCredentials: true,
        }
      );

      // ✅ Backend now returns { success, data }
      setUser(res.data.data);

      // Save FCM token
      try {
        const token =
          await getFCMToken();

        if (token) {
          await API.post(
            "/api/v1/auth/save-token",
            { token },
            {
              withCredentials: true,
            }
          );
        }
      } catch (err) {
        console.error(
          "FCM token save failed:",
          err
        );
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await API.post(
        "/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);

      navigate("/login", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Logout failed:",
        err
      );
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

export const useAuth = () =>
  useContext(AuthContext);