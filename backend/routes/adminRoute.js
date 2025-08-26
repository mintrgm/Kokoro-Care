import express from "express";
import {
  addDoctor,
  loginAdmin,
  getAllDoctors,
  getAllAppointments,
  cancelAppointment,
  adminDashboard,
  logoutAdmin,
  updateDoctor,
  getAllUsers,
  updateUser,
  getOnlineAppointments,
  generateVideoCallLink,
} from "../controllers/adminController.js";

import { authAdmin, diskUpload } from "../middlewares/index.js";
import { changeAvailability } from "../controllers/doctorController.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModels.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.get("/check-auth", (req, res) => {
  if (req.session.isAdmin) return res.json({ success: true, role: "admin" });
  return res.json({ success: false });
});

adminRouter.get("/dashboard", authAdmin, adminDashboard);

adminRouter.post("/add-doctor", authAdmin, diskUpload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, getAllDoctors);
adminRouter.get("/doctor/:id", authAdmin, async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, doctor });
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
adminRouter.put("/doctor/:id", authAdmin, diskUpload.single("image"), updateDoctor);
adminRouter.delete("/delete-doctor/:id", authAdmin, async (req, res) => {
  try {
    const deleted = await doctorModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Delete doctor error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
adminRouter.patch("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/user/:id", authAdmin, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
adminRouter.delete("/user/:id", authAdmin, async (req, res) => {
  try {
    const deleted = await userModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

adminRouter.get("/users", authAdmin, getAllUsers);
adminRouter.put("/user/:id", authAdmin, diskUpload.single("image"), updateUser);

adminRouter.get("/all-appointments", authAdmin, getAllAppointments);
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointment);

adminRouter.get("/online-appointments", getOnlineAppointments);
adminRouter.post("/video-call-link", generateVideoCallLink);
adminRouter.get("/video-call-link", (req, res) => {
  try {
    if (!req.session.isAdmin)
      return res.status(401).json({ success: false, message: "Not authorized" });

    const roomName = Math.random().toString(36).substring(2, 8) + "-" + Date.now();
    const link = `https://meet.jit.si/${roomName}`;

    res.json({ success: true, link });
  } catch (error) {
    console.error("Video Call Link Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default adminRouter;
