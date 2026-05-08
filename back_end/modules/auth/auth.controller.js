import {
  registerService,
  loginService,
  getProfileService,
} from "./auth.service.js";

import bcrypt from "bcryptjs";
import User from "../account/user.model.js";

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passkey);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.passkey);

    if (samePassword) {
      return res.status(400).json({
        message: "New password must be different from current password.",
      });
    }
    user.passkey = newPassword; // auto-hashed
    user.mustChangePassword = false;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password.",
      error: error.message,
    });
  }
};

// REGISTER
export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Registration failed",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { user, token, mustChangePassword } = await loginService(req.body);

    if (mustChangePassword) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        mustChangePassword: true,
        token,
        user,
        message: "Password reset required.",
      });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Login failed",
    });
  }
};

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);

    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const updated = await updateUserService(req.params.id, req.body);

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
