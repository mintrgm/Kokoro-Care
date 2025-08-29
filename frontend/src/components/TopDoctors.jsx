import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 5,
    infinite: true,
    speed: 500,
    arrows: false,
    focusOnSelect: true,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, centerPadding: "0px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "0px" } },
    ],
  };

  const getCardStyle = (index) => {
    const pos = index - currentSlide;

    if (pos === 0) return "scale-105 z-20 blur-0"; 
    if (pos === -1 || pos === 1) return "scale-95 z-10 -translate-y-2 blur-[1px]"; 
    if (pos === -2 || pos === 2) return "scale-85 z-0 -translate-y-4 blur-[2px]";
    return "scale-75 z-0 -translate-y-6 blur-[3px]"; 
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center overflow-x-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            move: { enable: true, speed: 1 },
            opacity: { value: 0.5 },
            color: { value: "#BAE7FF" },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <div
        className="relative w-full z-10 pt-32" 
        style={{ background: "linear-gradient(to bottom, #040E21, #111720)" }}
      >
        <h1 className="text-4xl sm:text-5xl font-audiowide text-[#F8FBFF] mb-2 text-center">
          Doctor, Doctor… Who Do You Need?
        </h1>
        <p className="text-center sm:w-1/2 text-sm font-electrolize text-[#BAE7FF] mb-10 mx-auto">
          Scroll the lineup of medical superheroes and pick the one with the right powers for your needs.
        </p>

        <div className="relative w-full max-w-full px-0 overflow-visible">
          <Slider ref={sliderRef} {...settings} className="overflow-visible outline-none">
            {doctors.slice(0, 10).map((doctor, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${doctor._id}`);
                  scrollTo(0, 0);
                }}
                className={`px-2 transition-transform duration-500 ${getCardStyle(
                  index
                )} outline-none`}
              >
                <div className="rounded-[24px] overflow-hidden cursor-pointer border border-[#2C3743] shadow-lg bg-[#111720]">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-96 object-contain bg-[#111720]"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`rounded-full w-2 h-2 ${
                          doctor.available ? "bg-green-500" : "bg-gray-500"
                        }`}
                      ></span>
                      <p className="text-white text-xs">
                        {doctor.available ? "Available" : "Not Available"}
                      </p>
                    </div>
                    <p className="text-white text-lg font-audiowide mt-2">
                      {doctor.name}
                    </p>
                    <p className="text-[#BAE7FF] text-sm font-electrolize">
                      {doctor.speciality}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <button
            onClick={() => sliderRef.current.slickPrev()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 z-10 outline-none"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => sliderRef.current.slickNext()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 z-10 outline-none"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              navigate("/doctors");
              scrollTo(0, 0);
            }}
            className="px-12 py-3 rounded-full border-2 border-[#BAE7FF] bg-[#090A0A] text-[#BAE7FF] font-electrolize hover:bg-[#BAE7FF] hover:text-[#090A0A] transition-all duration-300 outline-none"
          >
            More
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;
