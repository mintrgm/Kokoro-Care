import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Context for Admin login and token
const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  // if aToken is not present then set aToken to empty string
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);

  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/all-doctors`, {
        headers: { aToken },
      });

      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.patch(
        `${backEndUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: { aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const value = {
    aToken,
    setAToken,
    backEndUrl,
    getAllDoctors,
    doctors,
    changeAvailability,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export { AdminContext, AdminContextProvider };
