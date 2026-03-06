import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("candidate");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse user");
    }
  }, []);

  const loginUser = (data) => {
    setUser(data);

    try {
      localStorage.setItem("candidate", JSON.stringify(data));
    } catch {
      console.error("Failed to save user");
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("candidate");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);