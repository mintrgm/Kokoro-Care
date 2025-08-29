import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { particlesOptions } from "./ParticlesConfig";
import { assets } from "../assets/assets";

const Footer = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative bg-[#090A0A] text-white overflow-hidden">
      <Particles
        id="footerParticles"
        className="absolute inset-0 z-0"
        init={particlesInit}
        options={particlesOptions}
      />

      <div className="grid md:grid-cols-2 relative z-10 items-end">
        <div className="flex items-end justify-center pb-6 translate-y-10">
          <img
            src={assets.HH}
            alt="HH"
            className="w-[760px] h-auto object-contain"
          />
        </div>

        <div className="flex flex-col justify-between p-8">
          <div>
            <h2 className="font-autowide text-6xl mb-2 text-[#F8FBFF]">
              Contact Us
            </h2>
            <p className="font-electro text-[#BAE7FF] mb-4">
              Whether it’s a question, concern, or just a hello, we’re here to listen and help.
            </p>

            <div className="relative">
              <img src={assets.Card} alt="Card" className="w-full" />

              <form className="absolute top-1/2 transform -translate-y-1/2 w-full px-8 flex flex-col items-center gap-3 z-10">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-3/4 border-b border-[#BAE7FF] bg-transparent text-white focus:outline-none py-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-3/4 border-b border-[#BAE7FF] bg-transparent text-white focus:outline-none py-2"
                />
                <textarea
                  placeholder="Message"
                  className="w-3/4 border-b border-[#BAE7FF] bg-transparent text-white focus:outline-none py-2 resize-none"
                  rows="3"
                />
                <button
                  type="button"
                  className="px-6 py-2 bg-[#090A0A] border border-[#BAE7FF] hover:bg-[#BAE7FF] hover:text-[#090A0A] transition rounded-md"
                  onClick={() => alert("Message received!")}
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          <div className="mt-4">
            <hr className="border-[#BAE7FF] mb-2" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#BAE7FF]">
                © 2025 Kokoro Care. All Rights Reserved.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/_minto.draws_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={assets.Ig} alt="Instagram" className="w-6 h-6" />
                </a>
                <a
                  href="https://www.youtube.com/@mint-rgm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={assets.Yt} alt="YouTube" className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/manita-thapa-90376718b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={assets.Li} alt="LinkedIn" className="w-6 h-6" />
                </a>
                <a
                  href="https://www.pinterest.com/mint0desu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={assets.Pt} alt="Pinterest" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
