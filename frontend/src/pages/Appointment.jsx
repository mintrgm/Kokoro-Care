import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { RelatedDoctors } from "../components";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";

const AppointmentTypeModal = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg flex flex-col gap-4 w-80">
        <h2 className="text-lg font-semibold text-center">
          Select Appointment Type
        </h2>
        <button
          onClick={() => onSelect("online")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Online (Video)
        </button>
        <button
          onClick={() => onSelect("visit")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          In-Person
        </button>
        <button
          onClick={onClose}
          className="text-gray-500 underline mt-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

AppointmentTypeModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, getDoctorsData, token } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [appointmentType, setAppointmentType] = useState(""); 

  useEffect(() => {
    if (doctors.length > 0) {
      const doc = doctors.find((d) => d._id === docId);
      setDocInfo(doc);
    }
  }, [docId, doctors]);

  useEffect(() => {
    if (!docInfo) return;

    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate]?.includes(formattedTime)
            ? false
            : true;

        if (isSlotAvailable)
          timeSlots.push({ dateTime: new Date(currentDate), time: formattedTime });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      slots.push(timeSlots);
    }

    setDocSlots(slots);
  }, [docInfo]);

  const handleBookClick = () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    if (!docSlots[slotIndex] || !slotTime) {
      toast.error("Please select a date and time slot first");
      return;
    }
    setShowModal(true);
  };

  const handleTypeSelect = async (type) => {
    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    setAppointmentType(type);
    setShowModal(false);

    try {
      const selectedDate = docSlots[slotIndex][0].dateTime;
      const slotDate = `${selectedDate.getDate()}_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}`;

      const { data } = await axiosInstance.post("/api/user/book-appointment", {
        docId,
        slotDate,
        slotTime,
        type, 
      });

      if (data.success) {
        toast.success(data.message);
        getDoctorsData(); 
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo?.image}
              className="w-full bg-primary sm:max-w-72 rounded-lg"
              alt={docInfo?.name}
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo?.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo?.degree} - {docInfo?.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo?.experience}
              </button>
            </div>
            <div>
              <p className="flex itemcenter gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo?.about}</p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol} {docInfo?.fees}
              </span>
            </p>
          </div>
        </div>

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((slot, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-r-gray-200"
                }`}
              >
                <p>{slot[0] && daysOfWeek[slot[0].dateTime.getDay()]}</p>
                <p>{slot[0] && slot[0].dateTime.getDate()}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll">
            {docSlots[slotIndex]?.map((slot, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(slot.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  slot.time === slotTime
                    ? "bg-primary text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
              >
                {slot.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button
            onClick={handleBookClick}
            className="bg-primary text-sm text-white font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

        {showModal && (
          <AppointmentTypeModal
            onSelect={handleTypeSelect}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    )
  );
};

export default Appointment;
