import React, { useContext, useEffect } from "react";
import { AdminContext, AppContext } from "../../context/";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const {
    getDashboardData,
    dashData,
    cancelAppointment,
    appointments,
  } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    getDashboardData();
  }, [appointments]);

  if (!dashData) return null;

  const {
    doctors = 0,
    appointments: totalAppointments = 0,
    patients = 0,
    latestAppointments = [],
  } = dashData;

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointment_icon} alt="Appointments" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{totalAppointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="Patients" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white mt-10 rounded border">
        <div className="flex items-center gap-2.5 p-4 border-b">
          <img src={assets.list_icon} alt="Latest Bookings" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div className="pt-2">
          {latestAppointments.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No recent appointments</p>
          ) : (
            latestAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={appointment.docData?.image || assets.default_profile}
                  alt={appointment.docData?.name || "Doctor"}
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {appointment.docData?.name || "Unknown Doctor"}
                  </p>
                  <p className="text-gray-600">{slotDateFormat(appointment.slotDate)}</p>
                </div>
                {appointment.isCancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : appointment.isCompleted ? (
                  <p className="text-green-400 text-xs font-medium">Completed</p>
                ) : (
                  <img
                    className="w-6 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="cancel"
                    onClick={() => cancelAppointment(appointment._id)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
