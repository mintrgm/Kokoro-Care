import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Context for Doctor login and token
const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const value = {
    dToken,
    setDToken,
    backEndUrl,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export { DoctorContextProvider, DoctorContext };
