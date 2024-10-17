import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <>
      <ToastContainer />
    </>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
