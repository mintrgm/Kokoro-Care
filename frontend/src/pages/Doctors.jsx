import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [activeFilter, setActiveFilter] = useState(speciality || "");
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const applyFilter = (selectedSpeciality) => {
    setActiveFilter(selectedSpeciality);
    if (selectedSpeciality) {
      setFilterDoc(doctors.filter((doctor) => doctor.speciality === selectedSpeciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter(activeFilter);
  }, [doctors]);

  const specialities = [
    "Gynecologist",
    "General physician",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="w-full min-h-screen bg-[#090A0A] pt-36 flex relative z-10">
      <div className="hidden sm:flex flex-col gap-6 px-4 fixed top-52 left-0 z-10">
        {specialities.map((spec) => (
          <button
            key={spec}
            onClick={() => (activeFilter === spec ? applyFilter("") : applyFilter(spec))}
            className={`
              h-14 w-400 flex items-center justify-center
              rounded-full border-2 border-[#F8FBFF]
              font-audiowide
              transition-all duration-300
              ${activeFilter === spec 
                  ? "bg-[#F8FBFF] text-black" 
                  : "text-[#F8FBFF] hover:bg-[#F8FBFF] hover:text-black"}
            `}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="sm:hidden flex overflow-x-auto gap-3 px-4 py-2 fixed top-36 left-0 w-full z-10">
        {specialities.map((spec) => (
          <button
            key={spec}
            onClick={() => (activeFilter === spec ? applyFilter("") : applyFilter(spec))}
            className={`
              h-14 w-28 flex-shrink-0 flex items-center justify-center
              rounded-full border-2 border-[#F8FBFF]
              text-[#F8FBFF] font-audiowide
              transition-all duration-300
              ${activeFilter === spec ? "bg-[#F8FBFF] text-[#090A0A]" : "hover:bg-[#F8FBFF] hover:text-[#090A0A]"}
            `}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="flex-1 ml-0 sm:ml-52 p-4 mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 z-10">
        {filterDoc.map((doctor, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${doctor._id}`)}
            className="rounded-[12px] overflow-hidden cursor-pointer bg-[#F8FBFF] hover:-translate-y-1 transition-all duration-300 flex flex-col w-72 h-100"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-96 h-96 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-32">
              <div>
                <p className="text-[#090A0A] text-lg font-audiowide mb-1">{doctor.name}</p>
                <p className="text-[#090A0A] text-sm font-electrolize">{doctor.speciality}</p>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span
                  className={`rounded-full w-3 h-3 ${doctor.available ? "bg-green-500" : "bg-gray-500"}`}
                ></span>
                <p className="text-[#090A0A] text-xs">{doctor.available ? "Available" : "Not Available"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
