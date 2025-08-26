import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModels.js";

const saltRounds = 10;

const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email" });
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
      return res.status(400).json({ success: false, message: "Password is not strong enough" });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(saltRounds));

    let imageUrl = "";
    if (imageFile?.path) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = uploadResult.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    } else {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    let parsedAddress;
    try { parsedAddress = JSON.parse(address); } 
    catch { return res.status(400).json({ success: false, message: "Invalid address format" }); }

    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      image: imageUrl,
      date: Date.now(),
    });

    await newDoctor.save();
    res.status(201).json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error("Add Doctor Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, experience, fees, speciality, degree, about } = req.body;

    const address = {};
    if (req.body["address[line1]"] || req.body["address[line2]"]) {
      address.line1 = req.body["address[line1]"] || "";
      address.line2 = req.body["address[line2]"] || "";
    }

    const updateData = { name, email, experience, fees, speciality, degree, about };
    if (Object.keys(address).length) updateData.address = address;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
      updateData.image = uploadResult.secure_url;
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedDoctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    res.json({ success: true, doctor: updatedDoctor, message: "Doctor updated successfully" });
  } catch (error) {
    console.error("Update Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await doctorModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    if (!users.length) return res.status(404).json({ success: false, message: "No users found" });
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, dob, address } = req.body;
    const updateData = { name, email, phone, gender, dob, address };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
      updateData.image = uploadResult.secure_url;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: updatedUser, message: "Patient updated successfully" });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await userModel.find({}).select("-password");
    res.json({ success: true, patients });
  } catch (error) {
    console.error("Get All Patients Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ bookingDate: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCancelled: true });

    const doctor = await doctorModel.findById(appointment.docId);
    if (doctor?.slots_booked?.[appointment.slotDate]) {
      doctor.slots_booked[appointment.slotDate] = doctor.slots_booked[appointment.slotDate].filter(
        slot => slot !== appointment.slotTime
      );
      await doctor.save();
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminDashboard = async (req, res) => {
  try {
    if (!req.session.isAdmin) return res.status(401).json({ success: false, message: "Not authorized" });

    const doctors = await doctorModel.find({});
    const patients = await userModel.find({});
    const appointments = await appointmentModel.find({}).sort({ bookingDate: -1 });

    const dashData = {
      doctors: doctors.length,
      patients: patients.length,
      appointments: appointments.length,
      latestAppointments: appointments.slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      return res.json({ success: true, message: "Logged in successfully" });
    }
    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const logoutAdmin = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
};

const getOnlineAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ type: "online" });
    console.log("Found online appointments:", appointments.length, appointments.map(a => a._id));
    res.json({ success: true, appointments });
  } catch (err) {
    console.error("Error fetching online appointments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const generateVideoCallLink = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) return res.status(400).json({ success: false, message: "appointmentId is required" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appointment.type !== "online") return res.status(400).json({ success: false, message: "Not an online appointment" });

    if (appointment.videoCallLink) return res.json({ success: true, link: appointment.videoCallLink });

    const roomName = `kokoro-${appointment._id}-${crypto.randomBytes(3).toString("hex")}`;
    const link = `https://meet.jit.si/${roomName}`;

    appointment.videoCallLink = link;
    await appointment.save();

    return res.json({ success: true, link });
  } catch (err) {
    console.error("Generate Video Call Link Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllPatients,
  getAllAppointments,
  cancelAppointment,
  adminDashboard,
  loginAdmin,
  logoutAdmin,
  getOnlineAppointments,
  generateVideoCallLink,
};
