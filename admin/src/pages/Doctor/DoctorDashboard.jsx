import React, { useContext, useEffect } from "react";
import { DoctorContext, AppContext } from "../../context/";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const {
    getDashboard,  
    dashboard,   
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    getDashboard();
  }, []);

  if (!dashboard) return null;

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        {[
          {
            icon: assets.earning_icon,
            label: "Earnings",
            value: `${currency} ${dashboard.earnings}`,
          },
          {
            icon: assets.appointment_icon,
            label: "Appointments",
            value: dashboard.appointments,
          },
          {
            icon: assets.patients_icon,
            label: "Patients",
            value: dashboard.patients,
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all"
          >
            <img className="w-14" src={icon} alt={label} />
            <div>
              <p className="text-xl font-semibold text-gray-600">{value}</p>
              <p className="text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white mt-10 rounded border">
        <div className="flex items-center gap-2.5 p-4 rounded-t border-b">
          <img src={assets.list_icon} alt="Latest Bookings" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4 overflow-auto max-h-[50vh]">
          {dashboard.latestAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
            >
              <img
                className="rounded-full w-10"
                src={appointment.userData.image}
                alt={appointment.userData.name}
              />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">
                  {appointment.userData.name}
                </p>
                <p className="text-gray-600">
                  {slotDateFormat(appointment.slotDate)}
                </p>
              </div>

              {appointment.isCancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : appointment.isCompleted ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-2">
                  <img
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                    onClick={() => cancelAppointment(appointment._id)}
                  />
                  <img
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Accept"
                    onClick={() => completeAppointment(appointment._id)}
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
