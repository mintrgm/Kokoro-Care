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
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  const address = profile.address || { line1: "", line2: "" };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updateData = {
        docId: profile._id,
        address: profile.address,
        fees: profile.fees,
        available: profile.available,
        about: profile.about,
        degree: profile.degree,
        speciality: profile.speciality,
        experience: profile.experience,
      };

      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/update-profile`,
        updateData,
        { withCredentials: true }
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
    <div className="flex flex-col gap-6 m-5 max-w-3xl mx-auto">
      <div>
        <img
          className="bg-primary/80 w-full sm:max-w-64 rounded-lg mx-auto"
          src={profile.image}
          alt={profile.name}
        />
      </div>

      <div className="flex-1 border border-stone-100 rounded-lg p-8 bg-white">
        <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
          {profile.name}
        </p>

        <div className="flex items-center gap-2 mt-1 text-gray-600">
          {isEdit ? (
            <>
              <input
                type="text"
                className="border rounded px-2 py-1 w-48"
                value={profile.degree || ""}
                placeholder="Degree"
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, degree: e.target.value }))
                }
              />
              <input
                type="text"
                className="border rounded px-2 py-1 w-48"
                value={profile.speciality || ""}
                placeholder="Speciality"
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, speciality: e.target.value }))
                }
              />
            </>
          ) : (
            <p>
              {profile.degree} - {profile.speciality}
            </p>
          )}

          {isEdit ? (
            <input
              type="number"
              min="0"
              className="border rounded px-2 py-1 w-20 ml-4"
              value={profile.experience || ""}
              placeholder="Years"
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, experience: e.target.value }))
              }
            />
          ) : (
            <button className="ml-4 py-0.5 px-2 border text-sm rounded-full">
              {profile.experience} years
            </button>
          )}
        </div>

        <div className="mt-4">
          <p className="flex items-center gap-1 text-sm font-medium text-neutral-800">
            About:
          </p>
          {isEdit ? (
            <textarea
              rows={4}
              className="border rounded w-full px-2 py-1 mt-1 text-gray-700"
              value={profile.about || ""}
              placeholder="Write something about yourself"
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, about: e.target.value }))
              }
            />
          ) : (
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">{profile.about}</p>
          )}
        </div>

        <p className="text-gray-600 font-medium mt-4">
          Appointment fee:{" "}
          <span className="text-gray-800">
            {currency}{" "}
            {isEdit ? (
              <input
                type="number"
                min="0"
                className="border rounded px-2 py-1 w-24"
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

        <div className="flex gap-2 py-2 items-start">
          <p className="font-medium">Address:</p>
          <div className="flex flex-col flex-1 gap-1">
            {isEdit ? (
              <>
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={address.line1}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...address, line1: e.target.value },
                    }))
                  }
                  placeholder="Line 1"
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={address.line2}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...address, line2: e.target.value },
                    }))
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

        <div className="mt-6 flex gap-2">
          {isEdit ? (
            <button
              disabled={loading}
              onClick={updateProfile}
              className={`px-5 py-2 rounded-full text-sm border border-primary transition-all ${
                loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-700"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-5 py-2 rounded-full text-sm border border-primary hover:bg-primary hover:text-white transition-all"
            >
              Edit
            </button>
          )}

          {!isEdit && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-5 py-2 rounded-full text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
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
  );
};

export default DoctorProfile;
