import User from "../account/user.model.js";
import { logLogin } from "../logs/loginlogs.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// VALIDATION
const validateLoginPayload = ({ email, passkey }) => {
  const errors = [];

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("email is required.");
  } else if (!emailPattern.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!passkey || typeof passkey !== "string" || !passkey.trim()) {
    errors.push("Password is required.");
  }

  return errors;
};

// REGISTER SERVICE
export const registerService = async (data) => {
  let { email, passkey, role, member_id } = data;

  email = email?.trim();
  passkey = passkey?.trim();

  const validationErrors = validateLoginPayload({ email, passkey });
  if (validationErrors.length > 0) {
    throw { status: 400, errors: validationErrors };
  }

  const allowedRoles = ["admin", "gatekeeper", "member"];
  if (!allowedRoles.includes(role)) {
    throw { status: 400, message: "Invalid role provided" };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: "Email already exists" };
  }

  const user = await User.create({
    email,
    passkey,
    role,
    member_id: member_id || null,
  });

  const userSafe = user.toObject();
  delete userSafe.passkey;

  return userSafe;
};

// LOGIN SERVICE
export const loginService = async ({ email, passkey }) => {
  const validationErrors = validateLoginPayload({ email, passkey });

  if (validationErrors.length > 0) {
    throw { status: 400, errors: validationErrors };
  }

  const user = await User.findOne({ email }).populate("member_id");

  if (!user) {
    throw { status: 400, errors: ["Invalid email or password."] };
  }

  const isMatch = await bcrypt.compare(passkey, user.passkey);

  if (!isMatch) {
    throw { status: 400, errors: ["Invalid email or password."] };
  }

  await logLogin(user._id);

  // REFETCH UPDATED USER
  const updatedUser = await User.findById(user._id).populate("member_id");

  const token = jwt.sign(
    {
      userId: updatedUser._id,
      role: updatedUser.role,
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" },
  );

  const userSafe = updatedUser.toObject();
  delete userSafe.passkey;

  return {
    token,
    user: userSafe,
    mustChangePassword: updatedUser.mustChangePassword,
  };
};

// PROFILE SERVICE
export const getProfileService = async (userId) => {
  return await User.findById(userId).populate("member_id");
};
