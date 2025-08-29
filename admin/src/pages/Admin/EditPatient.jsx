import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const EditPatient = ({ patient, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (patient) {
      let addressStr = "";
      if (patient.address && typeof patient.address === "object") {
        addressStr = `${patient.address.line1 || ""} ${patient.address.line2 || ""} ${patient.address.city || ""}`.trim();
      } else if (typeof patient.address === "string") {
        addressStr = patient.address;
      }

      setFormData({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        address: addressStr,
        gender: patient.gender || "",
        dob: patient.dob
          ? new Date(patient.dob).toISOString().split("T")[0]
          : "",
      });
      setImage(null);
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        data.append(key, value);
      }
      if (image) data.append("image", image);

      const res = await axios.put(`/api/admin/user/${patient._id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Patient updated successfully");
        onUpdate();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to update patient");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-electrolize text-white mb-4">Edit Patient</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 max-h-[80vh] overflow-y-auto pr-2 font-electrolize text-white"
        >
          <div>
            <label className="text-sm font-medium text-white">Upload Patient Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            >
              <option value="">Select Gender</option>
              <option value="Male" className="text-black">Male</option>
              <option value="Female" className="text-black">Female</option>
              <option value="Other" className="text-black">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-white">Birthday</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#84074B] px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#052F5F] text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditPatient.propTypes = {
  patient: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gender: PropTypes.string,
    dob: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditPatient;
