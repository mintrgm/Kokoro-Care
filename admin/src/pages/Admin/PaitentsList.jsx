import React, { useEffect, useState } from "react";
import EditPatient from "./EditPatient";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null); 

  const getAllPatients = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", {
        withCredentials: true,
      });
      if (data.success) {
        setPatients(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch patients");
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/user/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        getAllPatients();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  const handleEditClick = async (id) => {
    try {
      const { data } = await axios.get(`/api/admin/user/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        setEditingPatient(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch patient details");
    }
  };

  const handleCloseForm = () => {
    setEditingPatient(null);
  };

  const handleUpdate = () => {
    getAllPatients();
    setEditingPatient(null);
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium text-white">All Patients</h1>

      <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="border rounded-xl max-w-56 overflow-hidden group"
          >
            {patient.image && (
              <img
                src={patient.image}
                alt={patient.name}
                className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              />
            )}

            <div className="p-4">
              <p className="text-lg font-medium text-white">{patient.name}</p>
              <p className="text-sm text-white">{patient.email}</p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <button onClick={() => deletePatient(patient._id)}>
                  <img
                    src={assets.Delete}
                    alt="Delete Patient"
                    className="w-6 h-6 hover:opacity-70 cursor-pointer"
                  />
                </button>

                <button onClick={() => handleEditClick(patient._id)}>
                  <img
                    src={assets.Edit}
                    alt="Edit Patient"
                    className="w-6 h-6 hover:opacity-70 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPatient && (
        <EditPatient
          patient={editingPatient}
          onClose={handleCloseForm}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );

};

export default PatientsList;
