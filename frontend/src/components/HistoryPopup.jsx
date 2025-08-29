import { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets"; 
import PropTypes from "prop-types";

const HistoryPopup = ({ userId, onClose, onSelectChat }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/baymax/chat-history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };

    fetchHistory();
  }, [userId]);

  const handleDelete = async (chatId) => {
    try {
      await axios.delete(`http://localhost:8000/api/baymax/chat/${chatId}`);
      setHistory((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  const handleSelect = async (chatId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/baymax/chat/${chatId}`);
      onSelectChat(res.data.chat);
      onClose();
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-xl w-[90%] max-w-xl shadow-lg relative">
        <h2 className="text-xl font-offside font-bold mb-4 text-center">Chat History</h2>
        {history.length === 0 ? (
          <p className="text-center font-margarine text-gray-500">No history found.</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((chat, index) => (
              <li
                key={chat._id}
                className="p-2 border rounded hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              >
                <div onClick={() => handleSelect(chat._id)}>
                  <strong>Chat #{index + 1}</strong>{" "}
                  <span className="text-sm text-gray-500">
                    {new Date(chat.created_at).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(chat._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 p-1 hover:opacity-80 transition"
          title="Close"
        >
          <img src={assets.Close} alt="Close" className="w-full h-full object-contain" />
        </button>
      </div>
    </div>
  );
};

HistoryPopup.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectChat: PropTypes.func.isRequired,
};

export default HistoryPopup;
