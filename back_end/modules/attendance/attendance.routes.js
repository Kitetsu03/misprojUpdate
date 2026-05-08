import express from "express";
import {
  getAttendanceHandler,
  saveBulkAttendanceHandler,
  toggleAttendanceHandler,
  deleteGuestAttendanceHandler,
} from "./attendance.controller.js";

const router = express.Router();

// Get attendance by event/service
router.get("/:service_id", getAttendanceHandler);

// Save all attendance
router.post("/bulk", saveBulkAttendanceHandler);

// Toggle single attendance
router.post("/toggle", toggleAttendanceHandler);

router.delete("/guest/:id", deleteGuestAttendanceHandler);

export default router;
