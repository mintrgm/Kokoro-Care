import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [active, setActive] = useState("signup"); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, loadUserProfileData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (active === "signup") {
        const { data } = await axiosInstance.post("/api/user/register", { name, email, password });
        if (data.success) {
          toast.success(data.message);
          setActive("login"); 
        } else toast.error(data.message);
      } else {
        const { data } = await axiosInstance.post("/api/user/login", { email, password });
        if (data.success) {
          toast.success(data.message);
          if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
          setToken(true);
          await loadUserProfileData();
          navigate("/"); 
        } else toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#090A0A] font-electrolize overflow-hidden">
      <div className="relative z-10 flex justify-center items-start min-h-screen pt-40 px-6">
        <div className="relative w-full max-w-5xl h-[500px] flex shadow-2xl overflow-hidden">
          <div
            className={`absolute top-0 w-1/2 h-full transition-all duration-1000 ease-in-out z-20`}
            style={{
              left: active === "signup" ? "73%" : "25%", 
              transform: "translateX(-50%)",
            }}
          >
            <img
              src={assets.Slider}
              alt="Slider"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex w-full h-full">
            <div
              className={`flex-1 p-10 flex flex-col justify-center bg-[#121212] transition-all duration-700 ease-in-out ${
                active === "signup" ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl font-autowide text-white mb-6">Create Account</h2>
              <p className="text-sm text-gray-300 mb-4">Sign up to book appointments</p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="p-2 rounded bg-[#1E1E1E] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 rounded bg-[#1E1E1E] text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 rounded bg-[#1E1E1E] text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="bg-[#074C84] hover:bg-[#052f5f] rounded transition py-2 mt-2 text-white font-autowide">
                  Create Account
                </button>
              </form>
              <p className="text-gray-400 mt-4 text-sm">
                Already have an account?{" "}
                <span className="text-[#BAE7FF] underline cursor-pointer" onClick={() => setActive("login")}>
                  Login here
                </span>
              </p>
            </div>

            <div
              className={`flex-1 p-10 flex flex-col justify-center bg-[#121212] transition-all duration-700 ease-in-out ${
                active === "login" ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <h2 className="text-3xl font-autowide text-white mb-6">Login</h2>
              <p className="text-sm text-gray-300 mb-4">Login to access your account</p>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 rounded bg-[#1E1E1E] text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 rounded bg-[#1E1E1E] text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="bg-[#074C84] hover:bg-[#052f5f] rounded transition py-2 mt-2 text-white font-autowide">
                  Login
                </button>
              </form>
              <p className="text-gray-400 mt-4 text-sm">
                Create a new account?{" "}
                <span className="text-[#BAE7FF] underline cursor-pointer" onClick={() => setActive("signup")}>
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

export default LoginPage;
