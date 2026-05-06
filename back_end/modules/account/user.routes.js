import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "./user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
