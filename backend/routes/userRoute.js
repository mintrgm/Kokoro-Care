import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppoinment,
} from "../controllers/userController.js";
import express from "express";
import { authUser, upload } from "../middlewares/index.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", authUser, getUserProfile);
userRouter.post(
  "/profile",
  upload.single("image"),
  authUser,
  updateUserProfile
);

userRouter.post("/book-appointment", authUser, bookAppoinment);

export default userRouter;
