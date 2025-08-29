import React, { useContext, useEffect } from "react";
import { AdminContext, AppContext } from "../../context";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { getAllAppointments, appointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    getAllAppointments(); 
  }, []);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium font-electrolize text-[#F8FBFF]">All Appointments</p>

      <div className="bg-[#090A0A] rounded border border-white text-sm min-h-[60vh] max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-white">
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">#</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Patient</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Age</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Date & Time</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Doctor</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Fees</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Type</p>
          <p className="font-audiowide text-[#F8FBFF] font-bold text-base">Actions</p>
        </div>

        {appointments
          .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
          .map((appointment, index) => (
            <div
              key={appointment._id}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1fr] items-center text-[#F8FBFF] py-3 px-6 border-b border-white hover:bg-gray-800 font-electrolize text-sm"
            >
              <p className="max-sm:hidden">{index + 1}</p>

              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full bg-white"
                  src={appointment.userData.image}
                  alt={appointment.userData.name}
                />
                <p>{appointment.userData.name}</p>
              </div>

              <p className="max-sm:hidden">{calculateAge(appointment.userData.dob)}</p>

              <p>{slotDateFormat(appointment.slotDate)}, {appointment.slotTime}</p>

              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={appointment.docData.image || assets.default_profile}
                  alt={appointment.docData.name}
                />
                <p>{appointment.docData.name}</p>
              </div>

              <p>{currency} {appointment.amount}</p>

              <p className="capitalize">{appointment.type}</p> 

              <>
                {appointment.isCancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : appointment.isCompleted ? (
                  <p className="text-green-400 text-xs font-medium">Completed</p>
                ) : (
                  <p>
                    <img
                      className="w-6 cursor-pointer"
                      src={assets.cancel_icon}
                      alt="cancel"
                      onClick={() => cancelAppointment(appointment._id)}
                    />
                  </p>
                )}
              </>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllAppointments;
