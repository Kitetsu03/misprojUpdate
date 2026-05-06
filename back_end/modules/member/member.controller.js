import {
  getMembersService,
  getMemberByIdService,
  deleteMemberService,
  upsertMemberProfileService,
  findOrCreateUser,
} from "./member.service.js";

const createMemberForUser = async (req, res) => {
  try {
    const data = req.body;

    const user = await findOrCreateUser(data.email);

    const result = await upsertMemberProfileService(user._id, data);

    res.status(201).json(result);
  } catch (err) {
    if (
      err.message === "User not found" ||
      err.message === "Member already exists for this email" ||
      err.message === "User already has a member profile"
    ) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

const updateMemberByUserId = async (req, res) => {
  try {
    const result = await upsertMemberProfileService(
      req.params.userId,
      req.body,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE or COMPLETE PROFILE
const upsertMemberProfile = async (req, res) => {
  try {
    const result = await upsertMemberProfileService(
      req.params.userId,
      req.body,
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getMembers = async (req, res) => {
  try {
    const members = await getMembersService();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
const getMemberById = async (req, res) => {
  try {
    const member = await getMemberByIdService(req.params.id);
    res.json(member);
  } catch (error) {
    if (error.message === "Member not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateMember = async (req, res) => {
  try {
    const updated = await updateMemberService(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    if (error.message === "Member not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteMember = async (req, res) => {
  try {
    const result = await deleteMemberService(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === "Member not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

export {
  createMemberForUser,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  upsertMemberProfile,
  updateMemberByUserId,
};
