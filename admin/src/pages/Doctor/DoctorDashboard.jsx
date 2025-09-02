import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorContext, AppContext } from "../../context/";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const { getDashboard, dashboard, completeAppointment, cancelAppointment } =
    useContext(DoctorContext);

  const { slotDateFormat, currency } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard();
  }, []);

  if (!dashboard) return null;

  return (
    <div className="m-5 font-electrolize">
      <div className="flex flex-wrap gap-3">
        {[
          {
            icon: assets.earning_icon,
            label: "Earnings",
            value: `NRP ${dashboard.earnings}`,
            link: null, 
          },
          {
            icon: assets.appointment_icon,
            label: "Appointments",
            value: dashboard.appointments,
            link: "/doctor-appointments",
          },
          {
            icon: assets.patients_icon,
            label: "Patients",
            value: dashboard.patients,
            link: "/doctor/patients",
          },
        ].map(({ icon, label, value, link }) => (
          <div
            key={label}
            className={`flex items-center gap-3 bg-[#1E1E1E] p-5 min-w-52 rounded border border-white cursor-pointer hover:scale-105 transition-all ${
              link ? "hover:bg-[#2A2A2A]" : ""
            }`}
            onClick={() => link && navigate(link)}
          >
            <img className="w-12 h-12 object-contain" src={icon} alt={label} />
            <div>
              <p className="text-xl font-audiowide text-white">{value}</p>
              <p className="text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1E1E1E] mt-10 rounded border border-white">
        <div className="flex items-center gap-3 p-4 rounded-t border-b border-white">
          <img
            className="w-6 h-6 object-contain"
            src={assets.list_icon}
            alt="Latest Bookings"
          />
          <p className="text-white font-audiowide text-lg">Latest Bookings</p>
        </div>

        <div className="pt-4 overflow-auto max-h-[50vh]">
          {dashboard.latestAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center px-6 py-3 gap-4 hover:bg-[#2A2A2A] rounded transition-colors cursor-pointer"
              onClick={() =>
                navigate(`/doctor/appointments/${appointment._id}`)
              }
            >
              <img
                className="rounded-full w-12 h-12 object-cover"
                src={appointment.userData.image}
                alt={appointment.userData.name}
              />
              <div className="flex-1 text-sm">
                <p className="text-white font-medium">{appointment.userData.name}</p>
                <p className="text-gray-400">{slotDateFormat(appointment.slotDate)}</p>
              </div>

              {appointment.isCancelled ? (
                <p className="text-red-500 text-xs font-medium">Cancelled</p>
              ) : appointment.isCompleted ? (
                <p className="text-[#078448] text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-3">
                  <img
                    className="w-8 h-8 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      cancelAppointment(appointment._id);
                    }}
                  />
                  <img
                    className="w-8 h-8 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Accept"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      completeAppointment(appointment._id);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
