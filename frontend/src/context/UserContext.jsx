import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE from "../../config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

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
    }
  }, []);

  // ✅ INSIDE the component so it can access setUser
  // const refreshUser = useCallback(async () => {
  //   try {
  //     const storedToken = localStorage.getItem("token");
  //     const storedUser = localStorage.getItem("candidate");
      
  //     if (!storedToken || !storedUser) return;
  
  //     const parsedUser = JSON.parse(storedUser);
  //     const candidateId = parsedUser._id; // get ID from stored user
  
  //     console.log("Fetching candidate:", candidateId);
  
  //     const res = await axios.get(
  //       `${API_BASE}/api/candidate/profile/${candidateId}`,
  //       { headers: { Authorization: `Bearer ${storedToken}` } }
  //     );
  
  //     console.log("Fresh user data:", res.data);
  
  //     const freshUser = res.data; // change to res.data.candidate if needed
  //     setUser(freshUser);
  //     localStorage.setItem("candidate", JSON.stringify(freshUser));
  //   } catch (err) {
  //     console.error("❌ refreshUser failed:", err.response?.status, err.response?.data);
  //     // don't clear user on failure — keep showing cached data
  //   }
  // }, []);

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
    <UserContext.Provider value={{ user, token, updateUser, loginUser, logoutUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
// ❌ NO fetchUser exported from outside — that's what broke everything