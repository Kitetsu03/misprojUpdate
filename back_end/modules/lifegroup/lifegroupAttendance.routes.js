import express from "express";
import {
  createSession,
  recordLifeGroupAttendance,
} from "./lifegroupattendance.controller.js";

const router = express.Router();

router.post("/session", createSession);
router.post("/", recordLifeGroupAttendance);

export default router;
