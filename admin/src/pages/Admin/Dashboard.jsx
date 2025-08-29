import React, { useContext, useEffect, useRef } from "react";
import { AdminContext, AppContext } from "../../context/";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { getDashboardData, dashData, cancelAppointment, appointments } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();
  const statsRef = useRef(null);

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

  const videoCalls = latestAppointments.filter((a) => a.type === "online").length;

  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div
          onClick={() => navigate("/doctors-list")}
          className="flex items-center gap-2 bg-[#090A0A] p-4 min-w-52 rounded border-2 border-white cursor-pointer hover:scale-105 transition-all"
        >
          <img className="w-10" src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className="text-xl font-semibold text-[#F8FBFF] font-electrolize">{doctors}</p>
            <p className="text-[#F8FBFF] opacity-70 font-electrolize">Doctors</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/all-appointments")}
          className="flex items-center gap-2 bg-[#090A0A] p-4 min-w-52 rounded border-2 border-white cursor-pointer hover:scale-105 transition-all"
        >
          <img className="w-10" src={assets.appointment_icon} alt="Appointments" />
          <div>
            <p className="text-xl font-semibold text-[#F8FBFF] font-electrolize">{totalAppointments}</p>
            <p className="text-[#F8FBFF] opacity-70 font-electrolize">Appointments</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/patients-list")}
          className="flex items-center gap-2 bg-[#090A0A] p-4 min-w-52 rounded border-2 border-white cursor-pointer hover:scale-105 transition-all"
        >
          <img className="w-10" src={assets.patients_icon} alt="Patients" />
          <div>
            <p className="text-xl font-semibold text-[#F8FBFF] font-electrolize">{patients}</p>
            <p className="text-[#F8FBFF] opacity-70 font-electrolize">Patients</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/video-call")}
          className="flex items-center gap-2 bg-[#090A0A] p-4 min-w-52 rounded border-2 border-white cursor-pointer hover:scale-105 transition-all"
        >
          <img className="w-10" src={assets.VideoCall} alt="Video Calls" />
          <div>
            <p className="text-xl font-semibold text-[#F8FBFF] font-electrolize">{videoCalls}</p>
            <p className="text-[#F8FBFF] opacity-70 font-electrolize">Video Calls</p>
          </div>
        </div>

        <div
          onClick={scrollToStats}
          className="flex items-center gap-2 bg-[#090A0A] p-4 min-w-52 rounded border-2 border-white cursor-pointer hover:scale-105 transition-all"
        >
          <img className="w-10" src={assets.list_icon} alt="Stats" />
          <div>
            <p className="text-[#F8FBFF] opacity-70 font-electrolize">Stats</p>
          </div>
        </div>
      </div>

      <div className="bg-[#090A0A] mt-10 rounded border border-white w-[95%] mx-auto">
        <div className="flex items-center gap-2.5 p-4 border-b border-white">
          <img className="w-8" src={assets.list_icon} alt="Latest Bookings" />
          <p className="font-semibold text-[#F8FBFF] font-audiowide">Latest Bookings</p>
        </div>
        <div className="pt-2">
          {latestAppointments.length === 0 ? (
            <p className="text-center text-[#F8FBFF] opacity-70 py-6 font-electrolize">
              No recent appointments
            </p>
          ) : (
            latestAppointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center px-6 py-3 gap-3 hover:bg-gray-800">
                <img
                  className="rounded-full w-8 h-8 object-cover"
                  src={appointment.docData?.image || assets.default_profile}
                  alt={appointment.docData?.name || "Doctor"}
                />
                <div className="flex-1 text-sm">
                  <p className="text-[#F8FBFF] font-medium font-electrolize">{appointment.docData?.name || "Unknown Doctor"}</p>
                  <p className="text-[#F8FBFF] opacity-70 font-electrolize">{slotDateFormat(appointment.slotDate)}</p>
                </div>
                {appointment.isCancelled ? (
                  <p className="text-red-400 text-xs font-medium font-electrolize">Cancelled</p>
                ) : appointment.isCompleted ? (
                  <p className="text-green-400 text-xs font-medium font-electrolize">Completed</p>
                ) : (
                  <img
                    className="w-5 cursor-pointer"
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

      <div ref={statsRef} className="mt-16 bg-[#090A0A] p-6 rounded border border-white">
        <h2 className="text-xl font-audiowide text-[#F8FBFF] mb-4">Dashboard Stats</h2>
        <p className="text-[#F8FBFF] opacity-70 font-electrolize">(Charts and analytics will go here...)</p>
      </div>
    </div>
  );
};

export default Dashboard;
