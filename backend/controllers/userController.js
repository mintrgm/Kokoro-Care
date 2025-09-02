import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModels.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const saltRounds = 10;

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    req.session.user = {
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
    };

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ success: false, message: "All fields are required" });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }

      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return res.json({ success: false, message: "Invalid credentials" });
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name,
      };

      console.log("Session after login:", req.session);

      req.session.save((err) => {
        if (err) {
          console.log("Session save error:", err);
          return res.status(500).json({ success: false, message: "Session save failed" });
        }
        return res.json({ success: true, message: "Logged in successfully" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const getUserProfile = async (req, res) => {
    try {
      const userId = req.session.user.id;
      const userData = await userModel.findById(userId).select("-password");

      if (userData) {
        return res.json({ success: true, user: userData });
      } else {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  const updateUserProfile = async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const { name, phone, gender, dob, address } = req.body;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.gender = gender || user.gender;
      user.dob = dob || user.dob;
      user.address = address ? JSON.parse(address) : user.address;

  if (req.file) {
    console.log("File received:", req.file.originalname);

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
      user.image = result.secure_url;
      console.log("Image saved to user:", user.image);

      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
    }
  }

    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const userId = req.session.user?.id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { docId, slotDate, slotTime, type } = req.body;

    if (!docId || !slotDate || !slotTime || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    const slotsBooked = docData.slots_booked || {};

    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.status(400).json({ success: false, message: "Slot already booked" });
    }

    slotsBooked[slotDate] = slotsBooked[slotDate] || [];
    slotsBooked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select("-password");

    const newAppointment = new appointmentModel({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      bookingDate: Date.now(),
      type,
    });

    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    return res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log("Book appointment error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const appointments = await appointmentModel.find({ userId }).sort({ bookingDate: -1 });

    if (appointments.length > 0) {
      return res.json({ success: true, appointments });
    } else {
      return res.json({ success: false, message: "No appointments found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCancelled: true });

    const docData = await doctorModel.findById(appointmentData.docId);
    const slots_booked = docData.slots_booked;
    slots_booked[appointmentData.slotDate] = slots_booked[appointmentData.slotDate].filter(
      (slot) => slot !== appointmentData.slotTime
    );
    await doctorModel.findByIdAndUpdate(appointmentData.docId, { slots_booked });

    return res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const createCheckoutSession = async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'npr',
          product_data: {
            name: `Appointment with Dr. ${appointment.docData.name}`,
          },
          unit_amount: appointment.docData.fees * 100, 
        },
        quantity: 1,
      }],
      metadata: {
        appointmentId: appointmentId,
      },
      success_url: `${process.env.CLIENT_URL}/my-appointments?payment=success&appointmentId=${appointmentId}`,
      cancel_url: `${process.env.CLIENT_URL}/my-appointments?payment=cancelled&appointmentId=${appointmentId}`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const appointmentId = session.metadata.appointmentId;

      if (!appointmentId) {
        return res.status(400).send("Missing appointment ID in session metadata");
      }

      const appointment = await appointmentModel.findById(appointmentId);


      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }

      appointment.isPaymentDone = true;
      appointment.paymentDetails = {
        id: session.payment_intent,
        amount: session.amount_total,
        status: session.payment_status,
      };

      await appointment.save();

      console.log("Appointment payment updated:", appointmentId);
    } catch (err) {
      console.error("Failed to update appointment:", err.message);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).json({ received: true });
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("user_sid", { path: "/" });
    return res.json({ success: true, message: "Logged out successfully" });
  });
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  createCheckoutSession,
  stripeWebhookHandler,
  logoutUser,
};
