import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currencySymbol = "Rs.";
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(false); 
  const [loadingUser, setLoadingUser] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error?.response?.data?.message;

        if (message && message.includes("Session Expired")) {
          toast.error("Session expired. Please login again.");
          setUserData(null);
          setToken(false); 
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const loadUserProfileData = async () => {
    setLoadingUser(true); 

    try {
      const { data } = await axiosInstance.get("/api/user/profile", {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.user);
        setToken(true);
      } else {
        setUserData(null);
        setToken(false);
      }
    } catch (error) {
      setUserData(null);
      setToken(false);
    } finally {
      setLoadingUser(false); 
    }
  };

  const getDoctorsData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
    loadUserProfileData();
  }, []);

  const value = {
    currencySymbol,
    backEndUrl,
    doctors,
    getDoctorsData,
    userData,
    setUserData,
    loadingUser,
    loadUserProfileData,
    token, 
    setToken, 
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
