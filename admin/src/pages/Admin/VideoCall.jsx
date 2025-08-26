import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { AppContext } from "../../context";
import { assets } from "../../assets/assets";

const VideoCall = () => {
  const { slotDateFormat } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchOnlineAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/admin/online-appointments");
      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        setError(data.message || "Failed to load appointments");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineAppointments();
  }, []);

  const openModal = (appointment) => {
    setSelected(appointment);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  const generateLink = async () => {
    if (!selected) return;
    try {
      setGenerating(true);
      const { data } = await axiosInstance.post("/api/admin/video-call-link", {
        appointmentId: selected._id,
      });

      if (data.success && data.link) {
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === selected._id ? { ...a, videoCallLink: data.link } : a
          )
        );
        setSelected((prev) => ({ ...prev, videoCallLink: data.link }));
      } else {
        setError(data.message || "Failed to generate link");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex items-center gap-2 mb-3">
        <img src={assets.add_icon} alt="Video" className="w-6 h-6" />
        <p className="text-lg font-medium">Video Call Links</p>
      </div>

      <div className="bg-white rounded border text-sm min-h-[60vh] max-h-[80vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_3fr_3fr_2fr_3fr] py-3 px-6 border-b font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Actions</p>
          <p>Link</p>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-gray-400">No online appointments</div>
        ) : (
          appointments.map((a, idx) => (
            <div
              key={a._id}
              className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_3fr_3fr_2fr_3fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
            >
              <p className="max-sm:hidden">{idx + 1}</p>

              <div className="flex items-center gap-2 min-w-44">
                <img
                  className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                  src={a.userData?.image}
                  alt={a.userData?.name}
                />
                <p className="font-medium">{a.userData?.name}</p>
              </div>

              <p className="min-w-40">
                {slotDateFormat(a.slotDate)}, {a.slotTime}
              </p>

              <div className="flex items-center gap-2 min-w-44">
                <img
                  className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                  src={a.docData?.image}
                  alt={a.docData?.name}
                />
                <p>{a.docData?.name}</p>
              </div>

              <div className="min-w-32">
                <button
                  className={`px-4 py-2 rounded-full text-xs ${
                    a.videoCallLink
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/80"
                  }`}
                  disabled={!!a.videoCallLink}
                  onClick={() => openModal(a)}
                >
                  {a.videoCallLink ? "Generated" : "Generate Link"}
                </button>
              </div>

              <div className="flex items-center gap-2 min-w-60">
                {a.videoCallLink ? (
                  <>
                    <a
                      href={a.videoCallLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {a.videoCallLink}
                    </a>
                    <button
                      className="text-xs border px-2 py-1 rounded hover:bg-gray-100 transition"
                      onClick={() => copyToClipboard(a.videoCallLink)}
                    >
                      Copy
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          ))
        )}
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

            <h3 className="text-lg font-semibold mb-3">Video Call Link</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selected.userData?.name} • {slotDateFormat(selected.slotDate)}, {selected.slotTime}
              <br />
              Doctor: {selected.docData?.name}
            </p>

            {selected.videoCallLink ? (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <a
                  href={selected.videoCallLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {selected.videoCallLink}
                </a>
                <button
                  className="text-xs border px-2 py-1 rounded ml-2 hover:bg-gray-100 transition"
                  onClick={() => copyToClipboard(selected.videoCallLink)}
                >
                  Copy
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
                  onClick={generateLink}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
