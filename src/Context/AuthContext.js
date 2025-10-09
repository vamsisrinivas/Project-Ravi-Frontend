

// src/Context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ show spinner while restoring

  // Restore user/token on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    loadAuthState();
  }, []);

  // Login
  const login = async (userData, tokenValue) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", tokenValue);
      setUser(userData);
      setToken(tokenValue);
    } catch (error) {
      console.error("Login erroddddddddddddddddr:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Register (optional - if you want to handle sign up directly)
  const register = async (userData, tokenValue) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", tokenValue);
      setUser(userData);
      setToken(tokenValue);
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
