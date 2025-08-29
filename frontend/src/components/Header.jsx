import React, { useCallback, useRef } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { particlesOptions } from "./ParticlesConfig";
import { assets } from "../assets/assets";

const Header = () => {
    const mainSectionRef = useRef(null);

  const handleScroll = () => {
    if (mainSectionRef.current) {
      mainSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black">
      <Particles
        id="headerParticles"
        className="absolute inset-0 z-10"
        init={particlesInit}
        options={particlesOptions}
      />

      <img
        src={assets.Heart}
        alt="heart"
        className="absolute left-0 -rotate-45 w-96 z-20"
        style={{ top: "60%", zIndex: 50 }}
      />

      <img
        src={assets.MainC}
        alt="main character"
        className="absolute left-1/2 -translate-x-1/2 h-[100%] object-contain z-30"
        style={{ top: "16%", left: "55%" }}
      />

      <div className="absolute top-[25%] left-10 z-20 flex flex-col gap-4">
        <p className="text-white font-audiowide text-[60px]">Welcome to</p>
        <p className="text-white font-audiowide text-[140px] leading-none flex gap-[190px]">
          <span>KOKORO</span>
          <span>CARE</span>
        </p>
      </div>

      <div className="absolute bottom-[8rem] right-10 z-20 flex flex-col items-end gap-6">
        <p className="text-[24px] font-electrolize text-[#B4F5FD] max-w-sm text-right">
          Finding doctors made as easy as ordering pizza, except healthier.
        </p>
        <button
          onClick={handleScroll}
          className="font-electrolize border-2 border-[#B4F5FD] text-[#B4F5FD] px-8 py-3 rounded-full bg-transparent hover:bg-[#B4F5FD] hover:text-black transition-all duration-300"
        >
          Book an Appointment
        </button>
      </div>

      <div ref={mainSectionRef} className="absolute top-[100vh] w-full h-1"></div>
    </section>
  );
};

export default Header;
