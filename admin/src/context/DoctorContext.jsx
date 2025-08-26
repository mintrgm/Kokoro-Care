import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";
import PropTypes from "prop-types";

const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const { backEndUrl } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/doctor/appointments`, {
        withCredentials: true,
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch appointments");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to complete appointment");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to cancel appointment");
    }
  };

  const getDashboard = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/doctor/dashboard`, {
        withCredentials: true,
      });
      console.log("Dashboard API response:", data);
      if (data.success) {
        setDashboard(data.dashData ?? data.dashboard ?? null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch dashboard data");
    }
  };

  const getProfile = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/doctor/profile`, {
        withCredentials: true,
      });
      console.log("getProfile response:", data);
      if (data.success) {
        setProfile(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("getProfile error:", error);
      toast.error(error.message || "Failed to fetch profile");
    }
  };

  const value = {
    appointments,
    dashboard,
    profile,
    setProfile,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    getDashboard,
    getProfile,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

DoctorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DoctorContext, DoctorContextProvider };


