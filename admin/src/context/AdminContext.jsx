import { createContext, useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";
import PropTypes from "prop-types";

const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [patients, setPatients] = useState([]);

  const { backEndUrl } = useContext(AppContext);

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/all-doctors`, { withCredentials: true });
      data.success ? setDoctors(data.doctors) : toast.error(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch doctors");
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const res = await axios.patch("/api/admin/change-availability", { docId });
      if (res.data.success) {
        toast.success(res.data.message);
        getAllDoctors();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to change availability");
    }
  };

  const deleteDoctor = async (docId) => {
    try {
      const res = await axios.delete(`/api/admin/delete-doctor/${docId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        getAllDoctors();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete doctor");
    }
  };

  const updateDoctor = async (doctorId, formData) => {
    try {
      const res = await axios.put(`/api/admin/doctor/${doctorId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        getAllDoctors();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update doctor");
    }
  };

  const fetchDoctorById = async (doctorId) => {
    try {
      const { data } = await axios.get(`/api/admin/doctor/${doctorId}`, { withCredentials: true });
      if (data.success) return data.doctor;
      toast.error(data.message);
      return null;
    } catch (error) {
      toast.error("Failed to fetch doctor");
      return null;
    }
  };

  const getAllPatients = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/users`, { withCredentials: true });
      data.success ? setPatients(data.users) : toast.error(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch patients");
    }
  };

  const deletePatient = async (userId) => {
    try {
      const res = await axios.delete(`${backEndUrl}/api/admin/user/${userId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        getAllPatients();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete patient");
    }
  };

  const updatePatient = async (userId, formData) => {
    try {
      const res = await axios.put(`${backEndUrl}/api/admin/user/${userId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        getAllPatients();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update patient");
    }
  };

  const fetchPatientById = async (userId) => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/user/${userId}`, { withCredentials: true });
      if (data.success) return data.user;
      toast.error(data.message);
      return null;
    } catch (error) {
      toast.error("Failed to fetch patient");
      return null;
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/all-appointments`, { withCredentials: true });
      data.success ? setAppointments(data.appointments) : toast.error(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error fetching appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backEndUrl}/api/admin/cancel-appointment`, { appointmentId }, { withCredentials: true });
      data.success ? toast.success(data.message) : toast.error(data.message);
      getAllAppointments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error canceling appointment");
    }
  };

  const getDashboardData = async () => {
    try {
      const res = await axios.get(`${backEndUrl}/api/admin/dashboard`, { withCredentials: true });
      if (res.data.success) setDashData(res.data.dashData);
      else toast.error(res.data.message || "Failed to load dashboard data");
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response || err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        getAllDoctors,
        doctors,
        changeAvailability,
        deleteDoctor,
        updateDoctor,
        fetchDoctorById,
        patients,
        getAllPatients,
        deletePatient,
        updatePatient,
        fetchPatientById,
        appointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashboardData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AdminContext, AdminContextProvider };
