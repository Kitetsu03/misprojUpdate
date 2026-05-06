import express from "express";
import { createMinistry, addMemberToMinistry } from "./ministry.controller.js";

const router = express.Router();

router.post("/", createMinistry);
router.post("/add-member", addMemberToMinistry);

export default router;
