import { createContext, useContext, useEffect, useState } from "react";

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [token, setToken] = useState(null);

  // Load from localStorage on refresh
  useEffect(() => {
    const storedCompany = localStorage.getItem("company");
    const storedToken = localStorage.getItem("companyToken");
  
    try {
      if (storedCompany && storedCompany !== "undefined") {
        setCompany(JSON.parse(storedCompany));
      }
  
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("LocalStorage parse error:", error);
      localStorage.removeItem("company");
    }
  }, []);

  // Login
  const loginCompany = (data, token) => {
    setCompany(data);
    setToken(token);

    localStorage.setItem("company", JSON.stringify(data));
    localStorage.setItem("companyToken", token);
  };

  // Logout
  const logoutCompany = () => {
    setCompany(null);
    setToken(null);

    localStorage.removeItem("company");
    localStorage.removeItem("companyToken");
  };

  // Update company data
  const updateCompany = (newData) => {
    const updated = { ...(company || {}), ...newData };
    setCompany(updated);
    localStorage.setItem("company", JSON.stringify(updated));
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        token,
        loginCompany,
        logoutCompany,
        updateCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);