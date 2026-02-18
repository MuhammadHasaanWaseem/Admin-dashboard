import React, { createContext, useContext, useState, useCallback } from "react";
import creads from "@/config/creads.json";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = creads.rootAdmin.email;
const ADMIN_PASSWORD = creads.rootAdmin.password;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin_auth") === "true";
  });

  const login = useCallback((email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
