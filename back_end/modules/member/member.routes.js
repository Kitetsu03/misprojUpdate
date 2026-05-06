import express from "express";
import {
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  createMemberForUser,
  updateMemberByUserId,
} from "./member.controller.js";

const router = express.Router();

router.put("/profile/:userId", updateMemberByUserId);

// CREATE
router.post("/", createMemberForUser);
router.post("/user/:userId", createMemberForUser);

// GENERAL
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

const BATCH_SIZE = 500;

// BULK IMPORT with duplicate handling logic
router.post("/import", async (req, res) => {
  try {
    const { members } = req.body;

    let success = 0;
    let failed = 0;
    let duplicates = 0;

    const cleanMembers = members.map((m) => ({
      ...m,
      email: m.email?.toLowerCase().trim(),
    }));

    const seen = new Set();

    const uniqueMembers = cleanMembers.filter((m) => {
      const email = m.email?.toLowerCase().trim();
      if (!email || seen.has(email)) return false;
      seen.add(email);
      return true;
    });

    try {
      const result = await Member.insertMany(uniqueMembers, {
        ordered: false,
      });

      success += result.length;
    } catch (err) {
      if (err.writeErrors) {
        duplicates = err.writeErrors.filter((e) => e.code === 11000).length;

        failed = err.writeErrors.length;

        success += err.result?.nInserted || 0;
      } else {
        throw err;
      }
    }

    res.json({
      total: members.length,
      success,
      duplicates,
      failed,
    });
  } catch (err) {
    res.status(500).json({
      message: "Import failed",
      error: err.message,
    });
  }
});

export default router;
