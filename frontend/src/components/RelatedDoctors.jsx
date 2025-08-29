import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDocs, setRelDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors && speciality) {
      const doctorsData = doctors.filter(
        (doctor) => doctor.speciality === speciality && doctor._id !== docId
      );
      setRelDocs(doctorsData);
    }
  }, [docId, speciality, doctors]);

  return (
    <div className="my-16 flex flex-col items-center">
      <h1 className="text-3xl font-medium text-white text-center">Top Doctors to Book</h1>
      <p className="text-white text-center text-sm mt-2 max-w-md">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="flex gap-6 overflow-x-auto mt-6 px-2 py-4 justify-center">
        {relDocs.slice(0, 10).map((doctor, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${doctor._id}`);
              scrollTo(0, 0);
            }}
            className="flex-none w-60 border border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 bg-[#0c1010]"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-80 object-cover bg-gray-800"
            />
            <div className="p-4 flex flex-col items-center">
              <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                <span className="bg-green-400 rounded-full w-2 h-2"></span>
                <span>Available</span>
              </div>
              <p className="text-white text-lg font-medium text-center">{doctor.name}</p>
              <p className="text-gray-300 text-sm text-center">{doctor.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="bg-[#021F40] text-white px-12 py-3 rounded-full hover:bg-[#01152a] transition"
        >
          more...
        </button>
      </div>
    </div>
  );
};

export default RelatedDoctors;
