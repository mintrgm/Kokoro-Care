import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="relative z-10">
      <div
        className="absolute top-0 left-0 w-full h-full -z-10"
        style={{
          background: `
            linear-gradient(to right, #090A0A 40%, #AFB5BE 100%),
            radial-gradient(ellipse at top right, rgba(0,0,0,0.25) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(0,0,0,0.25) 0%, transparent 50%)
          `,
          backgroundBlendMode: "overlay",
        }}
      />

      <div className="relative pt-44 px-6 md:px-16 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col justify-start md:w-1/2 gap-6 text-gray-200">
          <div className="text-left text-4xl md:text-5xl font-audiowide text-gray-100 mb-8">
            ABOUT US
          </div>

          <div className="flex flex-col gap-2 text-base md:text-lg">
            <p>
              Welcome to <b>Kokoro Care</b>, the healthcare platform where technology meets compassion. 
              Book appointments, pay online, or have video consultations effortlessly. 
              Chat with our witty <b>HelpBot</b> or explore insights with <b>Baymax</b>, your personal medical bot.
            </p>
            <p>
              Doctors can manage patient flow with the Doctor Dashboard, while Admins keep everything secure and smooth. 
              With Kokoro Care, healthcare is smart, fast, and just a few clicks away — helping you stay healthy and informed.
            </p>
          </div>

          <div className="text-left text-3xl font-audiowide text-gray-100 mt-32 mb-8">
          </div>

          <div className="relative h-[400px] md:h-[350px]">
            <div
              className="absolute top-60 left-0 w-64 md:w-72 bg-[#090A0A] text-[#F8FBFF] rounded-2xl border-8 shadow-lg transform rotate-[-20deg] flex flex-col items-center overflow-hidden z-10"
              style={{ borderColor: "transparent" }}
            >
              <div className="w-60 h-60 md:w-60 md:h-60 bg-gray-300 flex items-center justify-center">
                <img src={assets.Trust} alt="Trust" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <b className="block text-xl mb-2">Trust</b>
                <p className="text-sm">
                  Verified doctors, secure payments, and organized dashboards — peace of mind in every click.
                </p>
              </div>
            </div>

            <div
              className="absolute top-28 left-60 w-64 md:w-72 bg-[#090A0A] text-[#F8FBFF] rounded-2xl border-8 shadow-lg transform -rotate-[-40deg] flex flex-col items-center overflow-hidden z-20"
              style={{ borderColor: "transparent" }}
            >
              <div className="w-60 h-60 md:w-60 md:h-60 bg-gray-300 flex items-center justify-center">
                <img src={assets.Care} alt="Care" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <b className="block text-xl mb-2">Care</b>
                <p className="text-sm">
                  Tailored guidance from HelpBot and Baymax ensures every user feels genuinely cared for.
                </p>
              </div>
            </div>

            <div
              className="absolute bottom-10 left-16 w-64 md:w-72 bg-[#090A0A] text-[#F8FBFF] rounded-2xl border-8 shadow-lg transform rotate-[-12deg] flex flex-col items-center overflow-hidden z-30"
              style={{ borderColor: "transparent" }}
            >
              <div className="w-60 h-60 md:w-60 md:h-60 bg-gray-300 flex items-center justify-center">
                <img src={assets.Speed} alt="Speed" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <b className="block text-xl mb-2">Speed</b>
                <p className="text-sm">
                  Lightning-fast appointments, instant video consultations, and real-time notifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-end -translate-y-20">
          <img
            src={assets.About}
            alt="About"
            className="w-full md:max-w-[700px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
