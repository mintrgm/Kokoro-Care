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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (date) => {
    const [day, month, year] = date.split("_");
    return `${day} ${months[parseInt(month) - 1]}, ${year}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/appointments", { withCredentials: true });
      if (data.success) {
        setAppointments(data.appointments);
      }
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
      } else {
        toast.error(data.message);
      }
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

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
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

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {appointments &&
          appointments.map((appointment, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b">
              <div>
                <img
                  src={appointment.docData.image}
                  alt={appointment.docData.name}
                  className="w-32 bg-indigo-50"
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{appointment.docData.name}</p>
                <p>{appointment.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{appointment.docData.address.line1}</p>
                <p className="text-xs">{appointment.docData.address.line2}</p>
                <p className="text-sm mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                  {slotDateFormat(appointment.slotDate)} | {appointment.slotTime}
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {appointment.type === "online" &&
                appointment.videoCallLink &&
                !appointment.isCompleted && (
                  <button
                    onClick={() => openModal(appointment)}
                    className="sm:min-w-48 py-2 border bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Video Call
                  </button>
                )}

                {!appointment.isCancelled && appointment.isPaymentDone && !appointment.isCompleted && (
                  <button className="sm:min-w-48 py-2 border bg-indigo-50 rounded text-stone-500">
                    Paid
                  </button>
                )}
                {!appointment.isCancelled && !appointment.isPaymentDone && !appointment.isCompleted && (
                  <button
                    onClick={() => paymentHandler(appointment._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}
                {!appointment.isCancelled && !appointment.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {appointment.isCancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
                {appointment.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Appointment Completed
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-3">Join Video Call</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selected.userData?.name} • {slotDateFormat(selected.slotDate)}, {selected.slotTime}
              <br />
              Doctor: {selected.docData?.name}
            </p>
            <div className="p-3 bg-gray-50 rounded mb-4">
              <a
                href={selected.videoCallLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
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
