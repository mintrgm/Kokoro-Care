import { createContext, useState } from "react";

// Context for Admin login and token
const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  // if aToken is not present then set aToken to empty string
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const value = { aToken, setAToken, backEndUrl };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export { AdminContext, AdminContextProvider };
