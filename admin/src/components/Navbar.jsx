import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { assets } from "../assets/assets";

const Navbar = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const logoutUrl =
        userRole === "admin" ? "/api/admin/logout" : "/api/doctor/logout";

      await axiosInstance.post(logoutUrl, {}, { withCredentials: true });

      setUserRole(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-6 py-2 border-b bg-[#090A0A] border-gray-700">
      <div className="flex items-center gap-2 text-xs">
        <img
          src={assets.admin_logo}
          alt="Logo"
          className="w-24 sm:w-28 cursor-pointer"
          onClick={() =>
            navigate(userRole === "admin" ? "/admin-dashboard" : "/doctor-dashboard")
          }
          style={{ userSelect: "none" }}
        />
        <p className="border px-2 py-0.5 rounded-full border-gray-700 text-[#F8FBFF] font-audiowide text-xs sm:text-sm">
          {userRole === "admin" ? "Admin" : userRole === "doctor" ? "Doctor" : ""}
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-[#F8FBFF] text-[#090A0A] font-electrolize font-semibold text-xs sm:text-sm px-5 py-1.5 rounded-full hover:bg-[#BAE7FF] transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
