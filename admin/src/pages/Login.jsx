import React, { useState, useCallback } from "react";
import { assets } from "../assets/assets";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Login = () => {
  const [active, setActive] = useState("admin"); // admin or doctor
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  // Particles init
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: "#090A0A" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#ffffff" },
      links: { enable: true, distance: 150, color: "#ffffff", opacity: 0.1, width: 1 },
      collisions: { enable: false },
      move: { enable: true, speed: 1, random: true, straight: false, outModes: { default: "bounce" } },
      number: { value: 50, density: { enable: true, area: 800 } },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let email = "";
      let password = "";

      if (active === "admin") {
        endpoint = "/api/admin/login";
        email = adminEmail;
        password = adminPassword;
      } else {
        endpoint = "/api/doctor/login";
        email = doctorEmail;
        password = doctorPassword;
      }

      const { data } = await axiosInstance.post(endpoint, { email, password }, { withCredentials: true });

      if (data.success) {
        toast.success("Login Successful");
        window.location.href = active === "admin" ? "/admin-dashboard" : "/doctor-dashboard";
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#090A0A] font-electrolize overflow-hidden pt-24">
      {/* Particles Layer */}
      <Particles
        id="loginParticles"
        className="absolute inset-0 z-0"
        init={particlesInit}
        options={particlesOptions}
      />

      {/* Main Container */}
      <div className="relative z-10 flex justify-center px-6">
        <div className="relative w-full max-w-5xl flex shadow-2xl overflow-hidden h-[500px]">
          
          {/* Top Layer Slider Image */}
          <div
            className="absolute top-0 h-full w-1/2 z-20 transition-all duration-1000 ease-in-out overflow-hidden rounded-lg"
            style={{
              left: active === "admin" ? "75%" : "25%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              src={assets.Slider}
              alt="Slider"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative flex w-full h-full z-10">
            <div
              className={`flex-1 p-10 flex flex-col justify-center bg-[#121212] transition-all duration-700 ease-in-out ${
                active === "admin" ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl font-autowide text-white mb-4">Admin Login</h2>
              <p className="text-sm font-electro text-gray-300 mb-6">Access your admin dashboard</p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 rounded bg-[#1E1E1E] text-white hover:border hover:border-[#BAE7FF] transition"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 rounded bg-[#1E1E1E] text-white hover:border hover:border-[#BAE7FF] transition"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
                <button className="bg-[#074C84] hover:bg-[#052f5f] rounded transition py-2 mt-2 text-white font-autowide">
                  Login
                </button>
              </form>
              <p className="text-gray-400 mt-4 text-sm">
                Doctor Login?{" "}
                <span className="text-[#BAE7FF] underline cursor-pointer" onClick={() => setActive("doctor")}>
                  Click here
                </span>
              </p>
            </div>

            <div
              className={`flex-1 p-10 flex flex-col justify-center bg-[#121212] transition-all duration-700 ease-in-out ${
                active === "doctor" ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl font-autowide text-white mb-4">Doctor Login</h2>
              <p className="text-sm font-electro text-gray-300 mb-6">Access your doctor dashboard</p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 rounded bg-[#1E1E1E] text-white hover:border hover:border-[#BAE7FF] transition"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 rounded bg-[#1E1E1E] text-white hover:border hover:border-[#BAE7FF] transition"
                  value={doctorPassword}
                  onChange={(e) => setDoctorPassword(e.target.value)}
                  required
                />
                <button className="bg-[#074C84] hover:bg-[#052f5f] rounded transition py-2 mt-2 text-white font-autowide">
                  Login
                </button>
              </form>
              <p className="text-gray-400 mt-4 text-sm">
                Admin Login?{" "}
                <span className="text-[#BAE7FF] underline cursor-pointer" onClick={() => setActive("admin")}>
                  Click here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
