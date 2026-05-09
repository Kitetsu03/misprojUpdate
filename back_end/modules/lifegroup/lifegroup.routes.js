import express from "express";

import {
  createLifeGroup,
  getLifeGroups,
  archiveLifeGroup,
} from "./lifegroup.controller.js";

const router = express.Router();

/* GET */
router.get("/", getLifeGroups);

/* CREATE */
router.post("/", createLifeGroup);

/* ARCHIVE */
router.put("/archive/:id", archiveLifeGroup);

export default router;
