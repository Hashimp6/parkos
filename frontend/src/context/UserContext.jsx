import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE from "../../config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("candidate");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedUser !== "undefined") setUser(JSON.parse(storedUser));
      if (storedToken && storedToken !== "undefined") setToken(storedToken);
    } catch (err) {
      console.error("Failed to load user:", err);
      localStorage.removeItem("candidate");
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // ← always mark done
    }
  }, []);


  const loginUser = (data, tkn) => {
    setUser(data);
    setToken(tkn);
    localStorage.setItem("candidate", JSON.stringify(data));
    localStorage.setItem("token", tkn);
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("candidate", JSON.stringify(data));
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("candidate");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, loading, updateUser, loginUser, logoutUser }}>
    {children}
  </UserContext.Provider>

  );
};

export const useUser = () => useContext(UserContext);
// ❌ NO fetchUser exported from outside — that's what broke everything