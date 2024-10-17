import { createContext, useState } from "react";

// Context for Admin login and token
const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState("");
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const value = { aToken, setAToken, backEndUrl };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export { AdminContext, AdminContextProvider };
