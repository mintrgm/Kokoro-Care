import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context";
import { assets } from "../../assets/assets";
import EditDoctor from "./EditDoctor";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const DoctorsList = () => {
  const { doctors, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const fetchDoctorById = async (id) => {
    try {
      const { data } = await axios.get(`/api/admin/doctor/${id}`, { withCredentials: true });
      if (data.success) {
        setEditingDoctor(data.doctor);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch doctor details");
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
          >
            <img
              src={doctor.image}
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              alt={doctor.name}
            />

            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{doctor.name}</p>
              <p className="text-zinc-600 text-sm">{doctor.speciality}</p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <input
                  id={doctor._id}
                  type="checkbox"
                  checked={doctor.available}
                  onChange={() => changeAvailability(doctor._id)}
                />
                <label htmlFor={doctor._id}>
                  <p>available</p>
                </label>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this doctor?")) {
                      deleteDoctor(doctor._id);
                    }
                  }}
                >
                  <img
                    src={assets.Delete}
                    alt="Delete Doctor"
                    className="w-6 h-6 hover:opacity-70 cursor-pointer"
                  />
                </button>

                <button onClick={() => fetchDoctorById(doctor._id)}>
                  <img src={assets.Edit} alt="Edit Doctor" className="w-6 h-6 hover:opacity-70 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingDoctor && (
        <>
          {console.log("Editing doctor object:", editingDoctor)}
          <EditDoctor
            doctor={editingDoctor}
            onClose={() => setEditingDoctor(null)}
            onUpdate={getAllDoctors}
          />
        </>
      )}
    </div>
  );
};

export default DoctorsList;
