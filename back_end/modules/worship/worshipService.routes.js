import express from "express";
import { createService, getServices } from "./worshipService.controller.js";
import verifyToken from "../auth/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createService);
router.get("/", verifyToken, getServices);
export default router;
