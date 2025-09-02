import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const slotDateFormat = (date) => {
    const [day, month, year] = date.split("_");
    return `${day} ${months[parseInt(month) - 1]}, ${year}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/appointments", { withCredentials: true });
      if (data.success) setAppointments(data.appointments);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.warn("Session expired. Please login again.");
        return navigate("/login");
      }
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserAppointments();
    const paymentStatus = searchParams.get("payment");
    const appointmentId = searchParams.get("appointmentId");
    if (paymentStatus === "success" && appointmentId) {
      toast.success("Payment successful!");
      setTimeout(() => {
        getUserAppointments();
      }, 2000);
    }
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/user/cancel-appointment",
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.warn("Session expired. Please login again.");
        return navigate("/login");
      }
      toast.error(error.message);
    }
  };

  const paymentHandler = async (appointmentId) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/user/create-checkout-session",
        { appointmentId },
        { withCredentials: true }
      );
      if (data.success && data.url) window.location.href = data.url;
      else toast.error(data.message || "Failed to initiate payment");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.warn("Session expired. Please login again.");
        return navigate("/login");
      }
      toast.error(error.message);
    }
  };

  const openModal = (appointment) => {
    setSelected(appointment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  const getButtonStyles = (type, state) => {
    const colors = {
      video: "#074C84",
      paid: "#078448",
      cancel: "#84074B",
    };
    const isDone = state === "done";

    return {
      baseClass: "border border-white font-electrolize px-4 py-2 rounded transition",
      style: {
        backgroundColor: isDone ? colors[type] : "transparent",
        color: "white",
      },
      hoverStyle: !isDone ? { backgroundColor: colors[type], color: "white" } : {},
    };
  };

  return (
    <div className="relative pt-28" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(180deg, #090A0A, #061328, #090A0A)" }}></div>

      <p className="relative z-10 pb-3 font-audiowide text-2xl text-white border-b">My appointments</p>

      <div className="relative z-10 mt-6 flex flex-col gap-6">
        {appointments.map((appointment, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row justify-between gap-4 bg-transparent border border-white rounded p-4">
            <div>
              <img src={appointment.docData.image} alt={appointment.docData.name} className="w-32 bg-indigo-50" />
            </div>

            <div className="flex-1 flex flex-col gap-1 text-white">
              <p className="font-audiowide text-lg">{appointment.docData.name}</p>
              <p className="font-electrolize">{appointment.docData.speciality}</p>
              <p className="font-electrolize text-sm mt-1">Address:</p>
              <p className="font-electrolize text-xs">{appointment.docData.address.line1}</p>
              <p className="font-electrolize text-xs">{appointment.docData.address.line2}</p>
              <p className="font-audiowide text-sm mt-1">
                Date & Time: {slotDateFormat(appointment.slotDate)} | {appointment.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {appointment.type === "online" && (
                <>
                  {appointment.videoCallLink ? (
                    (() => {
                      const { baseClass, style, hoverStyle } = getButtonStyles("video", appointment.isCompleted ? "done" : "");
                      return (
                        <button
                          onClick={() => openModal(appointment)}
                          className={baseClass}
                          style={style}
                          onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
                          onMouseLeave={(e) =>
                            Object.assign(e.target.style, { backgroundColor: style.backgroundColor, color: style.color })
                          }
                        >
                          Video Call
                        </button>
                      );
                    })()
                  ) : (
                    <button className="border border-white px-4 py-2 rounded font-electrolize text-white bg-gray-700 cursor-not-allowed">
                      Generating link...
                    </button>
                  )}
                </>
              )}

              {appointment.isPaymentDone && !appointment.isCompleted && (
                (() => {
                  const { baseClass, style } = getButtonStyles("paid", "done");
                  return <button className={baseClass} style={style}>Paid</button>;
                })()
              )}

              {!appointment.isPaymentDone && !appointment.isCompleted && (
                (() => {
                  const { baseClass, style, hoverStyle } = getButtonStyles("paid", "");
                  return (
                    <button
                      onClick={() => paymentHandler(appointment._id)}
                      className={baseClass}
                      style={style}
                      onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
                      onMouseLeave={(e) =>
                        Object.assign(e.target.style, { backgroundColor: style.backgroundColor, color: style.color })
                      }
                    >
                      Pay Online
                    </button>
                  );
                })()
              )}

              {!appointment.isCancelled && !appointment.isCompleted && (
                (() => {
                  const { baseClass, style, hoverStyle } = getButtonStyles("cancel", "");
                  return (
                    <button
                      onClick={() => cancelAppointment(appointment._id)}
                      className={baseClass}
                      style={style}
                      onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
                      onMouseLeave={(e) =>
                        Object.assign(e.target.style, { backgroundColor: style.backgroundColor, color: style.color })
                      }
                    >
                      Cancel Appointment
                    </button>
                  );
                })()
              )}

              {appointment.isCancelled && (
                (() => {
                  const { baseClass, style } = getButtonStyles("cancel", "done");
                  return <button className={baseClass} style={style}>Appointment Cancelled</button>;
                })()
              )}

              {appointment.isCompleted && (
                (() => {
                  const { baseClass, style } = getButtonStyles("paid", "done");
                  return <button className={baseClass} style={style}>Appointment Completed</button>;
                })()
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold" onClick={closeModal}>
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-3">Join Video Call</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selected.userData?.name} • {slotDateFormat(selected.slotDate)}, {selected.slotTime}
              <br />
              Doctor: {selected.docData?.name}
            </p>
            <div className="p-3 bg-gray-50 rounded mb-4">
              <a href={selected.videoCallLink} target="_blank" rel="noreferrer" className="text-[#1E283D] underline break-all">
                {selected.videoCallLink}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
