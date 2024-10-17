import { createContext } from "react";

const AppContext = createContext();

// Context for App
const AppContextProvider = (props) => {
  const value = {};

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
