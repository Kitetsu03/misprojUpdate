import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "./user.service.js";

// CREATE
const createUser = async (req, res) => {
  try {
    const user = await createUserService({
      email: req.body.email,
      passkey: req.body.passkey,
      role: req.body.role,
      member_id: null,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

// GET ALL
const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateUser = async (req, res) => {
  try {
    const updated = await updateUserService(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
