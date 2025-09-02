import React, { useContext, useEffect, useState } from "react";
import { DoctorContext, AppContext } from "../../context/";
import { toast } from "react-toastify";
import axios from "axios";
import DoctorPassword from "./DoctorPassword";

const DoctorProfile = () => {
  const { profile, getProfile, setProfile } = useContext(DoctorContext);
  const { currency, backEndUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  if (!profile) {
    return <div className="text-center mt-10 text-white">Loading profile...</div>;
  }

  const address = profile.address || { line1: "", line2: "" };

  // Update profile with image support
  const updateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("docId", profile._id);
      formData.append("degree", profile.degree || "");
      formData.append("speciality", profile.speciality || "");
      formData.append("experience", profile.experience || 0);
      formData.append("about", profile.about || "");
      formData.append("fees", profile.fees || 0);
      formData.append("available", profile.available);
      formData.append("addressLine1", profile.address?.line1 || "");
      formData.append("addressLine2", profile.address?.line2 || "");

      // If user selected a new file, send it
      if (profile.newImageFile) {
        formData.append("image", profile.newImageFile);
      }

      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/update-profile`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        getProfile();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col m-5 max-w-5xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row gap-6 bg-[#13191D] rounded-lg p-6">
        
        {/* Profile Image */}
        <div className="flex-shrink-0 flex flex-col justify-center sm:justify-start items-center relative">
          <img
            className="w-[22rem] h-[34rem] rounded-lg object-cover border-2 border-white cursor-pointer"
            src={profile.newImageFile ? URL.createObjectURL(profile.newImageFile) : profile.image}
            alt={profile.name}
            onClick={() => isEdit && document.getElementById("photoInput").click()}
          />

          {isEdit && (
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setProfile((prev) => ({ ...prev, newImageFile: file }));
              }}
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-3xl font-audiowide font-semibold">{profile.name}</p>

            <div className="flex flex-wrap items-center gap-3 mt-1">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-48 text-black"
                    value={profile.degree || ""}
                    placeholder="Degree"
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, degree: e.target.value }))
                    }
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-48 text-black"
                    value={profile.speciality || ""}
                    placeholder="Speciality"
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, speciality: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    className="border rounded px-2 py-1 w-24 text-black"
                    value={profile.experience || ""}
                    placeholder="Years"
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, experience: e.target.value }))
                    }
                  />
                </>
              ) : (
                <>
                  <p>{profile.degree} - {profile.speciality}</p>
                  <button className="ml-4 py-0.5 px-2 border text-sm rounded-full bg-white text-[#052F5F]">
                    {profile.experience} years
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium">About:</p>
            {isEdit ? (
              <textarea
                rows={4}
                className="border rounded w-full px-2 py-1 text-black"
                value={profile.about || ""}
                placeholder="Write something about yourself"
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, about: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-200 mt-1">{profile.about}</p>
            )}
          </div>

          <p>
            Appointment fee:{" "}
            <span className="font-semibold">
              {currency}{" "}
              {isEdit ? (
                <input
                  type="number"
                  min="0"
                  className="border rounded px-2 py-1 w-24 text-black"
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, fees: e.target.value }))
                  }
                  value={profile.fees || ""}
                />
              ) : (
                profile.fees
              )}
            </span>
          </p>

          <div className="flex gap-2 items-start">
            <p className="font-medium">Address:</p>
            <div className="flex flex-col flex-1 gap-1">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-black"
                    value={address.line1}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, address: { ...address, line1: e.target.value } }))
                    }
                    placeholder="Line 1"
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-black"
                    value={address.line2}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, address: { ...address, line2: e.target.value } }))
                    }
                    placeholder="Line 2"
                  />
                </>
              ) : (
                <>
                  <p>{address.line1}</p>
                  <p>{address.line2}</p>
                </>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="available"
              onChange={() =>
                isEdit &&
                setProfile((prev) => ({ ...prev, available: !prev.available }))
              }
              checked={profile.available}
            />
            <label htmlFor="available" className="select-none">
              Available
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {isEdit ? (
              <button
                disabled={loading}
                onClick={updateProfile}
                className={`px-5 py-2 rounded-full text-sm border border-[#052F5F] ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-black"
                    : "bg-[#052F5F] text-white hover:bg-[#041f3f]"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-5 py-2 rounded-full text-sm border border-[#052F5F] hover:bg-[#052F5F] hover:text-white"
              >
                Edit
              </button>
            )}

            {!isEdit && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-5 py-2 rounded-full text-sm border border-[#84074B] text-[#84074B] hover:bg-[#84074B] hover:text-white"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <DoctorPassword onClose={() => setShowPasswordForm(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
