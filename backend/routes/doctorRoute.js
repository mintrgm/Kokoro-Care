import express from "express";
import {
  getDoctorsList,
  loginDoctor,
  getDoctorAppointments,
  appointmentCompleted,
  cancelAppointment,
  doctorDashboard,
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorPassword,
  logoutDoctor
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", getDoctorsList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor, getDoctorAppointments);
doctorRouter.post("/complete-appointment", authDoctor, appointmentCompleted);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointment);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.post("/update-password", authDoctor, updateDoctorPassword);
doctorRouter.post("/logout", authDoctor, logoutDoctor);
doctorRouter.get("/check-auth", (req, res) => {
  if (req.session.doctorId) {
    return res.json({ success: true, role: "doctor" });
  }
  return res.json({ success: false });
});

export default doctorRouter;
