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
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs ">
        <img
          src={assets.admin_logo}
          alt="Logo"
          className="w-36 s:w-40 cursor-pointer"
          onClick={() =>
            navigate(userRole === "admin" ? "/admin-dashboard" : "/doctor-dashboard")
          }
          style={{ userSelect: "none" }}
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {userRole === "admin" ? "Admin" : userRole === "doctor" ? "Doctor" : ""}
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
