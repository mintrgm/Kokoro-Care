import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import UserPassword from "./UserPassword";

const MyProfile = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { userData, setUserData, loadUserProfileData } = useContext(AppContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await loadUserProfileData();
      } catch (err) {
        console.error("Failed to load user profile", err);
        navigate("/login");
      }
    };
    if (!userData) fetchProfile();
  }, [userData, loadUserProfileData, navigate]);

  if (!userData) return <p className="text-white text-lg">Loading profile...</p>;

  const imageSrc = image
    ? URL.createObjectURL(image)
    : userData?.image
    ? userData.image
    : "/default-profile.png";

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify(userData.address));
      if (image) formData.append("image", image);

      const { data } = await axiosInstance.post("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setImage(null);
        setIsEdit(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile.");
    }
  };

  return (
    <div className="z-20 flex justify-center w-full min-h-screen bg-[#090A0A]">
  <div className="flex flex-col md:flex-row w-full max-w-5xl gap-10 p-8 mt-36">
    <div className="flex-1 flex flex-col gap-6 text-white">
      {isEdit ? (
        <input
          type="text"
          value={userData.name}
          className="bg-gray-800 text-5xl font-autowide p-2 rounded"
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="text-5xl font-autowide">{userData.name}</p>
      )}

      <hr className="bg-gray-700 h-[2px] border-none" />

      <div>
        <p className="text-2xl font-autowide underline mb-4">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-3 text-lg font-electro text-gray-300">
          <p className="font-autowide">Email id:</p>
          <p className="text-blue-400">{userData.email}</p>

          <p className="font-autowide">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              value={userData.phone}
              className="bg-gray-800 p-1 rounded max-w-xs"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}

          <p className="font-autowide">Address:</p>
          {isEdit ? (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={userData.address.line1}
                className="bg-gray-800 p-1 rounded max-w-xs"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <input
                type="text"
                value={userData.address.line2}
                className="bg-gray-800 p-1 rounded max-w-xs"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-gray-400">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-2xl font-autowide underline mb-4">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-3 text-lg font-electro text-gray-300">
          <p className="font-autowide">Gender:</p>
          {isEdit ? (
            <select
              value={userData.gender}
              className="bg-gray-800 p-1 rounded max-w-xs"
              onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}

          <p className="font-autowide">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              value={userData.dob}
              className="bg-gray-800 p-1 rounded max-w-xs"
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        {isEdit ? (
          <button
            className="px-8 py-3 rounded-full border border-[#074C84] hover:bg-[#074C84] hover:text-white transition-all text-lg"
            onClick={updateUserProfile}
          >
            Save Information
          </button>
        ) : (
          <>
            <button
              className="px-8 py-3 rounded-full border border-[#074C84] hover:bg-[#074C84] hover:text-white transition-all text-lg"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-8 py-3 rounded-full border border-[#84074B] hover:bg-[#84074B] hover:text-white transition-all text-lg"
            >
              Change Password
            </button>
          </>
        )}
      </div>
    </div>

    <div className="flex-1 flex justify-center items-start relative z-30">
      {isEdit ? (
        <label htmlFor="image" className="relative cursor-pointer">
          <img
            src={imageSrc}
            alt="User"
            className="w-[28rem] h-[28rem] rounded opacity-80" 
          />
          {!image && (
            <img
              src={assets.upload_icon}
              alt="Upload"
              className="w-16 absolute bottom-4 right-4"
            />
          )}
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => e.target.files[0] && setImage(e.target.files[0])}
          />
        </label>
      ) : (
        <img src={imageSrc} alt="User" className="w-[28rem] h-[28rem] rounded z-30" />
      )}
    </div>
  </div>

  {showPasswordModal && (
    <UserPassword onClose={() => setShowPasswordModal(false)} userId={userData._id} />
  )}
</div>

  );
};

export default MyProfile;
