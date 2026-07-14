import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAuthToken } from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // Try refresh token via httpOnly cookie first
      const { data } = await api.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      setToken(data.token);
      setAuthToken(data.token);
      setUser(data.user);
    } catch {
      setToken(null);
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setToken(null);
    setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put("/auth/update-profile", updates);
    setUser(data.user);
    return data;
  };

  const toggleWishlist = async (placeId) => {
    const { data } = await api.post(`/auth/wishlist/${placeId}`);
    setUser((prev) => ({ ...prev, wishlist: data.wishlist }));
    return data.wishlist;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    toggleWishlist,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
