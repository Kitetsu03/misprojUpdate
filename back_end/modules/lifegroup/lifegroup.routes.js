import express from "express";
import {
  createLifeGroup,
  addMemberToLifeGroup,
} from "./lifegroup.controller.js";

const router = express.Router();

router.post("/", createLifeGroup);
router.post("/add-member", addMemberToLifeGroup);

export default router;
