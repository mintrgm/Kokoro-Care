import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body; 

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const doctor = await doctorModel.findById(docId); 

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available; 
    await doctor.save(); 

    return res.status(200).json({
      success: true,
      message: `Doctor is now ${doctor.available ? "available" : "unavailable"}`,
      available: doctor.available
    });
  } catch (error) {
    console.error("Error changing availability:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorsList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    if (doctors) {
      res.json({ success: true, doctors });
    } else {
      res.json({ success: false, message: "No doctor found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const isMatchPassword = await bcrypt.compare(password, doctor.password);
    if (!isMatchPassword) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    delete req.session.user;
    delete req.session.adminId;

    req.session.doctorId = doctor._id.toString();

    return res.json({ success: true, message: "Logged in successfully" });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const docId = req.session.doctorId; 
    console.log("Doctor ID in session (appointments):", docId);

    if (!docId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const appointments = await appointmentModel.find({ docId }).sort({
      slotDate: "asc",
      slotTime: "asc",
    });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCompleted = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.session.doctorId; 

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: "Appointment completed" });
    } else {
      return res.json({ success: false, message: "Invalid appointment" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.session.doctorId; 

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCancelled: true });
      return res.json({ success: true, message: "Appointment cancelled" });
    } else {
      return res.json({ success: false, message: "Invalid appointment" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const docId = req.session.doctorId;
    console.log("Doctor ID in session (dashboard):", docId);
    
    if (!docId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const appointments = await appointmentModel.find({ docId }).sort({
      slotDate: "asc",
      slotTime: "asc",
    });

    let earnings = 0;
    appointments.forEach(appointment => {
      if (appointment.isCompleted || appointment.isPaymentDone) {
        earnings += appointment.amount;
      }
    });

    let patients = [];
    appointments.forEach(appointment => {
      if (!patients.includes(appointment.userId)) {
        patients.push(appointment.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const docId = req.session.doctorId; 

    if (!docId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const profileData = await doctorModel.findById(docId).select(["-password"]);

    if (!profileData) {
      return res.json({ success: true, profileData: null });
    }

    return res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available, password } = req.body;
    const docData = await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      password,
    });

    return res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctorPassword = async (req, res) => {
  try {
    const docId = req.session.doctorId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    doctor.password = hashedPassword;
    await doctor.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logoutDoctor = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
};

export {
  changeAvailability,
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
};

