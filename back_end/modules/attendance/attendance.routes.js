import express from "express";
import { recordAttendance, getAttendance } from "./attendance.controller.js";

const router = express.Router();
router.post("/", recordAttendance);
router.get("/", getAttendance);

export default router;
