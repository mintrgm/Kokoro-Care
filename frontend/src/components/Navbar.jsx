import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../utils/axiosInstance";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBaymaxPage = location.pathname === "/baymax";

  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/user/logout");
      setToken(false);
      setUserData(null);
      localStorage.removeItem("uToken");
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowMenu(false);
  };

  const links = [
    { to: "/", label: "HOME" },
    { to: "/doctors", label: "OUR DOCTORS" },
    { to: "/baymax", label: "BAYMAX" },
    { to: "/about", label: "ABOUT US" },
  ];

  return (
    <div
      className="fixed top-0 left-0 w-full flex flex-col z-30 backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: isBaymaxPage ? "rgba(0,0,0,0.8)" : "rgba(248,251,255,0.1)",
      }}
    >
      <div className="flex items-center justify-between text-sm py-2 px-10 font-audiowide">
        <img
          className="w-32 cursor-pointer"
          onClick={handleLogoClick}
          src={assets.Logo}
          alt="logo"
        />

        <ul className="hidden md:flex items-center gap-8 text-lg">
          {links.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => handleNavClick(item.to)}
              className={({ isActive }) =>
                `py-1 relative transition duration-300 ${
                  isActive ? "text-[#F8FBFF]" : "text-[#F8FBFF]/60"
                } hover:text-[#AAF3FC]`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img
                className="w-20 h-20 rounded-full border-4 border-[#BAE7FF]"
                src={userData.image || assets.avatarPlaceholder}
                alt="profile"
              />
              <div className="absolute top-0 right-0 pt-14 z-20 hidden group-hover:block">
                <div className="min-w-[220px] bg-[#1A1A1A] border border-white rounded flex flex-col gap-0 font-electrolize">
                  <p
                    onClick={() => handleNavClick("my-profile")}
                    className="cursor-pointer px-4 py-2 text-[#BAE7FF] hover:text-white transition-colors"
                  >
                    My Profile
                  </p>
                  <hr className="border-t border-white/30 my-0" />
                  <p
                    onClick={() => handleNavClick("my-appointments")}
                    className="cursor-pointer px-4 py-2 text-[#BAE7FF] hover:text-white transition-colors"
                  >
                    My Appointments
                  </p>
                  <hr className="border-t border-white/30 my-0" />
                  <p
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-2 text-[#BAE7FF] hover:text-white transition-colors"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick("/login")}
              className="font-electrolize px-8 py-3 rounded-full border-2 border-[#B4F5FD] text-[#B4F5FD] text-base transition hover:bg-[#B4F5FD] hover:text-black"
            >
              Create Account
            </button>
          )}

          <img
            src={assets.menu_icon}
            alt=""
            className="w-8 md:hidden"
            onClick={() => setShowMenu(true)}
          />

          <div
            className={`${
              showMenu ? "fixed w-full" : "h-0 w-0"
            } md:hidden top-0 right-0 bottom-0 bg-white z-40 overflow-hidden transition-all`}
          >
            <div className="flex items-center justify-between px-5 py-6">
              <img className="w-40" src={assets.logo} alt="" />
              <img
                className="w-8"
                src={assets.cross_icon}
                alt="close"
                onClick={() => setShowMenu(false)}
              />
            </div>
            <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-audiowide">
              {links.map((item, index) => (
                <li key={index} onClick={() => handleNavClick(item.to)}>
                  <p>{item.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="h-[2px] w-full bg-gradient-to-r from-[#7D8791] via-[#BAE7FF] to-[#2C3743] bg-[length:200%_200%] animate-[moveGradient_4s_linear_infinite]" />

      <style>
        {`
          @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;
