import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="relative z-20 flex flex-col items-center pt-40 pb-24 gap-6 text-gray-800"
      style={{
        background: "linear-gradient(to bottom, #090A0A, #040E21)",
      }}
    >
      <h1 className="text-4xl sm:text-5xl font-audiowide text-white mt-4">
        Find by Speciality
      </h1>

      <p className="sm:w-1/2 text-center text-sm font-electrolize text-[#AAF3FC] mt-2">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      <div className="flex justify-center gap-[80px] pt-10 overflow-x-auto">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-500"
          >
            <div className="w-[150px] h-[150px] rounded-full border-2 border-[#F8FBFF] overflow-hidden flex items-center justify-center
                            transition-all duration-500 hover:border-[#2C3743] hover:scale-105">
              <img
                src={item.image}
                alt={item.speciality}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 text-[#AAF3FC] text-center font-electrolize group-hover:text-white transition-colors duration-300">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu
