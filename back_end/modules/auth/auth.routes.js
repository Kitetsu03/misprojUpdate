import express from "express";
import { register, login, getProfile } from "./auth.controller.js";
import verifyToken from "./auth.middleware.js";
import { changePassword } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/change-password", changePassword);

export default router;
