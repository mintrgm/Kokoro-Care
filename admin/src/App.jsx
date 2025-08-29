import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  AllAppointments,
  AddDoctor,
  Dashboard,
  DoctorsList,
  DoctorDashboard,
  DoctorAppointments,
  DoctorProfile,
  PatientsList,
  VideoCall,
} from "./pages/";
import axiosInstance from "./utils/axiosInstance";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminRes = await axiosInstance.get("/api/admin/check-auth", {
          withCredentials: true,
        });
        if (adminRes.data.success) {
          setUserRole("admin");
          setLoading(false);
          return;
        }
        const doctorRes = await axiosInstance.get("/api/doctor/check-auth", {
          withCredentials: true,
        });
        if (doctorRes.data.success) {
          setUserRole("doctor");
          setLoading(false);
          return;
        }
        setUserRole(null);
      } catch (err) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center mt-10">Checking login...</div>;

  if (!userRole) {
    return (
      <>
        <Login setUserRole={setUserRole} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="bg-[#090A0A]">
      <Navbar userRole={userRole} setUserRole={setUserRole} />
      <ToastContainer />
      <div className="flex items-start">
        <Sidebar userRole={userRole} />
        {userRole === "admin" && (
          <Routes>
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctors-list" element={<DoctorsList />} />
            <Route path="/patients-list" element={<PatientsList />} />
            <Route path="/video-call" element={<VideoCall />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
          </Routes>
        )}

        {userRole === "doctor" && (
            <Routes>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route path="*" element={<Navigate to="/doctor-dashboard" />} />
            </Routes>
        )}
      </div>
    </div>
  );
};

export default App;
