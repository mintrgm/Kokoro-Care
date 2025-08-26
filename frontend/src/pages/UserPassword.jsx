import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UserPassword = ({ onClose, userId }) => {
  const { backEndUrl } = useContext(AppContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPassword !== rePassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/user/update-password`,
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowCurrent((prev) => !prev)}
            >
              {showCurrent ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowNew((prev) => !prev)}
            >
              {showNew ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showRe ? "text" : "password"}
              placeholder="Re-enter New Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowRe((prev) => !prev)}
            >
              {showRe ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordUpdate}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPassword;
