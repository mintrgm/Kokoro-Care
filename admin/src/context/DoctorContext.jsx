import { createContext } from "react";

// Context for Doctor login and token
const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const value = {};

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
