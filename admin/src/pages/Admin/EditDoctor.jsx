import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";

const EditDoctor = ({ doctor, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    fees: "",
    speciality: "",
    degree: "",
    address: { line1: "", line2: "" },
    about: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        experience: doctor.experience || "",
        fees: doctor.fees || "",
        speciality: doctor.speciality || "",
        degree: doctor.degree || "",
        address: {
          line1: doctor.address?.line1 || "",
          line2: doctor.address?.line2 || "",
        },
        about: doctor.about || "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "line1" || name === "line2") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (key === "address") {
          data.append("address[line1]", value.line1);
          data.append("address[line2]", value.line2);
        } else {
          data.append(key, value);
        }
      }

      if (image) {
        data.append("image", image);
      }

      const res = await axios.put(
        `/api/admin/doctor/${doctor._id}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        onUpdate();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update doctor");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-electrolize text-white mb-4">Edit Doctor</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 overflow-y-auto max-h-[80vh] pr-2 font-electrolize text-white"
        >
          <div>
            <label className="text-sm font-medium text-white">Upload Doctor Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Doctor Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Doctor Email</label>
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
            <label className="text-sm font-medium text-white">Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            >
              <option value="">Select experience</option>
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>
                  {i} {i === 1 ? "year" : "years"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-white">Fees</label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Speciality</label>
            <select
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
              required
            >
              <option value="">Select Speciality</option>
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-white">Education</label>
            <input
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Address Line 1</label>
            <input
              name="line1"
              value={formData.address.line1}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">Address Line 2</label>
            <input
              name="line2"
              value={formData.address.line2}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white">About Doctor</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 text-white bg-gray-800"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditDoctor.propTypes = {
  doctor: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditDoctor;
