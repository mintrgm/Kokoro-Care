import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = ({ userRole }) => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-6 cursor-pointer transition-all duration-200 font-electrolize ${
      isActive
        ? "bg-[#1A1C1C] border-r-4 border-[#BAE7FF] text-[#F8FBFF] font-audiowide"
        : "text-[#F8FBFF] opacity-80 hover:opacity-100"
    }`;

  const wrapperStyle = "h-screen bg-[#090A0A] border-r border-gray-700 w-64 flex-shrink-0";

  const navLinks = {
    admin: [
      { to: "/admin-dashboard", icon: assets.home_icon, label: "Dashboard" },
      { to: "/all-appointments", icon: assets.appointment_icon, label: "Appointments" },
      { to: "/add-doctor", icon: assets.add_icon, label: "Add Doctor" },
      { to: "/doctors-list", icon: assets.people_icon, label: "Doctors List" },
      { to: "/patients-list", icon: assets.patient_icon, label: "Patients List" },
      { to: "/video-call", icon: assets.VideoCall, label: "Video Call" },
    ],
    doctor: [
      { to: "/doctor-dashboard", icon: assets.home_icon, label: "Dashboard" },
      { to: "/doctor-appointments", icon: assets.appointment_icon, label: "Appointments" },
      { to: "/doctor-profile", icon: assets.people_icon, label: "Profile" },
    ],
  };

  const links = userRole === "admin" ? navLinks.admin : navLinks.doctor;

  if (!links) return null;

  return (
    <div className={wrapperStyle}>
      <ul className="mt-5">
        {links.map(({ to, icon, label }) => (
          <NavLink to={to} key={to} className={linkStyle}>
            <img src={icon} alt={label} className="w-5 h-5" />
            <p className="hidden md:block">{label}</p>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
