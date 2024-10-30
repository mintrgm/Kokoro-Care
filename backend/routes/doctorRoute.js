import express from "express";
import {
  getDoctorsList,
  loginDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", getDoctorsList);
doctorRouter.post("/login", loginDoctor);

export default doctorRouter;
