import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5001/api/auth/current-user",
        {
          withCredentials: true,
        }
      );
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
    }
    setLoading(false);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:5001/api/auth/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of server response
      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5001/api/users/profile",
        userData,
        { withCredentials: true }
      );
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    checkUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
