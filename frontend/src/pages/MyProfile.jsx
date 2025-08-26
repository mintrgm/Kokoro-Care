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

  if (!userData) return <p>Loading profile...</p>;

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
    <div className="flex flex-col max-w-lg gap-2 text-sm">
      {isEdit ? (
        <label htmlFor="image" className="inline-block relative cursor-pointer">
          <img className="w-36 rounded opacity-75" src={imageSrc} alt="User" />
          {!image && (
            <img
              className="w-10 absolute bottom-12 right-12"
              src={assets.upload_icon}
              alt="Upload Icon"
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
        <img src={imageSrc} alt="User" className="w-36 rounded" />
      )}

      {isEdit ? (
        <input
          type="text"
          value={userData.name}
          className="bg-gray-100 text-3xl font-medium max-w-60 mt-4"
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="text-3xl font-medium mt-4 text-neutral-800">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-400">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              value={userData.phone}
              className="bg-gray-100 max-w-52"
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <>
              <input
                type="text"
                value={userData.address.line1}
                className="bg-gray-100 max-w-52 mb-1"
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
                className="bg-gray-100 max-w-52"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              value={userData.gender}
              className="max-w-28 bg-gray-100"
              onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              value={userData.dob}
              className="max-w-28 bg-gray-100"
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={updateUserProfile}
          >
            Save Information
          </button>
        ) : (
          <>
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-5 py-2 rounded-full text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            >
              Change Password
            </button>
          </>
        )}
      </div>

      {showPasswordModal && (
        <UserPassword
          onClose={() => setShowPasswordModal(false)}
          userId={userData._id}
        />
      )}
    </div>
  );
};

export default MyProfile;
