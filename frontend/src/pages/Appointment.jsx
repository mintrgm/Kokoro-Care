import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { RelatedDoctors } from "../components";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";

const AppointmentTypeModal = ({ onSelect, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-[#F8FBFF] p-6 rounded-2xl flex flex-col gap-4 w-80 shadow-xl">
      <h2 className="text-lg font-autowide text-center text-[#090A0A]">
        Select Appointment Type
      </h2>
      <button
        onClick={() => onSelect("online")}
        className="bg-[#074C84] hover:bg-[#052f5f] text-[#F8FBFF] px-4 py-2 rounded-xl transition"
      >
        Online (Video)
      </button>
      <button
        onClick={() => onSelect("visit")}
        className="bg-green-600 hover:bg-green-700 text-[#F8FBFF] px-4 py-2 rounded-xl transition"
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

AppointmentTypeModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, getDoctorsData, token } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(null);
  const [slotTime, setSlotTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  const timeScrollRef = useRef(null);
  const [showScrollArrows, setShowScrollArrows] = useState(false);

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
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotAvailable = !docInfo.slots_booked[slotDate]?.includes(formattedTime);

        if (isSlotAvailable) timeSlots.push({ dateTime: new Date(currentDate), time: formattedTime });

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
    if (slotIndex === null || !slotTime) {
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

  const scrollTimeSlots = (direction) => {
    if (timeScrollRef.current) {
      timeScrollRef.current.scrollBy({ left: direction * 100, behavior: "smooth" });
    }
  };

  return (
    docInfo && (
      <div className="relative z-10 bg-[#090A0A] text-[#F8FBFF] px-6 sm:px-20 pt-40 pb-20">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={docInfo?.image}
            className="w-64 sm:w-72 rounded-2xl shadow-lg object-cover"
            alt={docInfo?.name}
          />
          <div className="flex-1 border border-gray-700 rounded-2xl p-6 bg-[#0c1010] max-w-8xl h-[32rem]">
            <p className="flex items-center gap-2 text-3xl font-autowide">
              {docInfo?.name} <img className="w-6" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 font-electrolize">
              <p>{docInfo?.degree} - {docInfo?.speciality}</p>
              <span className="py-0.5 px-2 border text-xs rounded-full">{docInfo?.experience}</span>
            </div>
            <div className="mt-4 font-electrolize">
              <p className="flex items-center gap-1 text-lg font-medium">
                About <img src={assets.info_icon} />
              </p>
              <p className="text-sm opacity-80 mt-2">{docInfo?.about}</p>
            </div>
            <p className="font-medium mt-4 font-electrolize">
              Appointment fee: <span className="text-[#F8FBFF]">{currencySymbol} {docInfo?.fees}</span>
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-autowide mb-2">Booking slots</h3>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {docSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSlotIndex(index);
                      setShowScrollArrows(true);
                    }}
                    className={`text-center py-2 min-w-[70px] rounded-full cursor-pointer transition ${slotIndex === index ? "bg-[#021F40] text-white" : "border border-gray-600"}`}
                  >
                    <p className="text-sm font-medium">{slot[0] && daysOfWeek[slot[0].dateTime.getDay()]}</p>
                    <p className="text-sm font-medium">{slot[0] && slot[0].dateTime.getDate()}</p>
                  </div>
                ))}
              </div>

              {slotIndex !== null && (
                <div className="relative mt-4 flex items-center">
                  {showScrollArrows && (
                    <button
                      onClick={() => scrollTimeSlots(-1)}
                      className="absolute left-0 z-10 w-8 h-8 bg-[#021F40] border-2 border-[#F8FBFF] rounded-full flex items-center justify-center text-white hover:bg-[#021F40]"
                    >
                      &lt;
                    </button>
                  )}
                  <div ref={timeScrollRef} className="flex gap-3 overflow-x-hidden w-full max-w-[500px] px-12">
                    {docSlots[slotIndex]?.map((slot, index) => (
                      <p
                        key={index}
                        onClick={() => setSlotTime(slot.time)}
                        className={`text-sm px-5 py-2 rounded-full cursor-pointer transition whitespace-nowrap ${
                          slot.time === slotTime ? "bg-[#021F40] text-white" : "border border-gray-600 opacity-80"
                        }`}
                      >
                        {slot.time.toLowerCase()}
                      </p>
                    ))}
                  </div>
                  {showScrollArrows && (
                    <button
                      onClick={() => scrollTimeSlots(1)}
                      className="absolute right-0 w-8 h-8 bg-[#021F40] border-2 border-[#F8FBFF] rounded-full flex items-center justify-center text-white hover:bg-[#052f5f]"
                    >
                      &gt;
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={handleBookClick}
                className="bg-[#021F40] border-2 border-[#F8FBFF] hover:bg-[#052F5F] transition text-lg font-bold px-16 py-3 rounded-full my-12"
              >
                Book an appointment
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>

        {showModal && <AppointmentTypeModal onSelect={handleTypeSelect} onClose={() => setShowModal(false)} />}
      </div>
    )
  );
};

export default Appointment;
