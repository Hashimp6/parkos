import { createContext, useContext, useState, useEffect } from "react";

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
      localStorage.removeItem("candidate"); // clear bad data
      localStorage.removeItem("token");
    }
  }, []);

  const loginUser = (data, token) => {

    setUser(data);
    setToken(token);

    localStorage.setItem("candidate", JSON.stringify(data));
    localStorage.setItem("token", token);
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
    <UserContext.Provider
      value={{ user, token,updateUser, loginUser, logoutUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);