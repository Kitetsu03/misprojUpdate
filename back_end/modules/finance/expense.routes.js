import express from "express";
import { createExpense } from "./expense.controller.js";

const router = express.Router();

router.post("/", createExpense);

export default router;
