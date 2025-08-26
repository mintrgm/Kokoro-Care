import express from "express";
import {
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
} from "../controllers/userController.js";

import { authUser, diskUpload } from "../middlewares/index.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", authUser, getUserProfile);
userRouter.post("/profile", authUser, diskUpload.single("image"), updateUserProfile);
userRouter.post("/update-password", authUser, updateUserPassword);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, getUserAppointments);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

userRouter.post("/create-checkout-session", authUser, createCheckoutSession);
userRouter.post("/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

userRouter.post("/logout", logoutUser);

export default userRouter;
