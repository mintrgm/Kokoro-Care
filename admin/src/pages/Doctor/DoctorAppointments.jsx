import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const { appointments, getAppointments, completeAppointment, cancelAppointment } =
    useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAppointments();
  }, []);

  const openModal = (appointment) => {
    setSelected(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="m-5 text-center text-gray-400 font-electrolize">
        No appointments available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl m-5 font-electrolize">
      <p className="mb-4 text-xl font-audiowide text-white">All Appointments</p>

      <div className="bg-[#1E1E1E] rounded border border-white text-sm min-h-[50vh] max-h-[80vh] overflow-y-auto">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b border-white text-white text-lg font-audiowide">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Type</p>
          <p>Status</p>
        </div>

        {appointments.map((appointment, index) => (
          <div
            key={appointment._id}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr] gap-1 items-center py-3 px-6 text-white border-b border-white hover:bg-[#2A2A2A] transition-colors"
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={appointment.userData?.image || assets.default_avatar}
                alt={appointment.userData?.name || "Patient"}
              />
              <p>{appointment.userData?.name || "Unknown"}</p>
            </div>

            <div>
              <p
                className={`text-xs inline px-2 py-1 rounded-full font-semibold ${
                  appointment.payment ? "border border-[#052F5F] text-[#052F5F]" : "border border-[#BAE7FF] text-[#BAE7FF]"
                }`}
              >
                {appointment.payment ? "Online" : "Online"}
              </p>
            </div>

            <p className="max-sm:hidden">
              {appointment.userData?.dob
                ? calculateAge(appointment.userData.dob)
                : "N/A"}
            </p>

            <p>{slotDateFormat(appointment.slotDate)}, {appointment.slotTime}</p>

            <p>{currency} {appointment.amount}</p>

            <p>
              {appointment.type === "online" ? (
                <button
                  className="text-sm bg-[#052F5F] text-white px-2 py-1 rounded hover:bg-[#041f3f] transition"
                  onClick={() => openModal(appointment)}
                >
                  Online
                </button>
              ) : (
                <span>Visit</span>
              )}
            </p>

            {appointment.isCancelled ? (
              <p className="text-red-500 text-xs font-semibold">Cancelled</p>
            ) : appointment.isCompleted ? (
              <p className="text-[#078448] text-xs font-semibold">Completed</p>
            ) : (
              <div className="flex gap-3">
                <img
                  src={assets.cancel_icon}
                  alt="Cancel"
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => cancelAppointment(appointment._id)}
                />
                <img
                  src={assets.tick_icon}
                  alt="Complete"
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => completeAppointment(appointment._id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] p-6 rounded-2xl w-full max-w-md shadow-lg relative border border-white">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            <h3 className="text-lg font-audiowide mb-3 text-white">
              Join Video Call
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              {selected.userData?.name} • {slotDateFormat(selected.slotDate)}, {selected.slotTime}
            </p>

            {selected.videoCallLink ? (
              <a
                href={selected.videoCallLink}
                target="_blank"
                rel="noreferrer"
                className="text-[#052F5F] underline break-all font-semibold"
              >
                {selected.videoCallLink}
              </a>
            ) : (
              <p className="text-gray-400">No link available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
