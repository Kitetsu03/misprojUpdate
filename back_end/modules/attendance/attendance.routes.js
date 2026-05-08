import express from "express";
import {
  getAttendanceHandler,
  saveBulkAttendanceHandler,
  toggleAttendanceHandler,
} from "./attendance.controller.js";

const router = express.Router();

router.get("/", getAttendanceHandler);
router.post("/bulk", saveBulkAttendanceHandler);
router.post("/toggle", toggleAttendanceHandler);

export default router;
