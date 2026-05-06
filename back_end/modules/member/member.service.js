import { generateTempPassword } from "../../utils/generatePassword.js";
import { sendTemporaryPassword } from "../../utils/sendEmail.js";
import User from "../account/user.model.js";
import Member from "./member.model.js";

const validateBasicInfo = (data) => {
  if (!data.first_name || !data.last_name) {
    throw new Error("First name and last name are required");
  }
};

const buildMemberPayload = (user, data) => ({
  first_name: data.first_name,
  middle_name: data.middle_name,
  last_name: data.last_name,
  suffix: data.suffix,
  birth_date: data.birth_date,
  marital_status: data.marital_status,
  sex: data.sex,
  contact_no: data.contact_no,
  email: user.email,
  address: {
    region: data.region,
    province: data.province,
    city: data.city,
    barangay: data.barangay,
  },
  created_by: data.created_by,
  updated_by: data.updated_by,
});

export const findOrCreateUser = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const existingMember = await Member.findOne({ email });

  if (existingMember) {
    const linkedUser = await User.findOne({
      member_id: existingMember._id,
    });

    if (linkedUser) {
      throw new Error("Member already exists for this email");
    }
  }

  let user = await User.findOne({ email });
  if (user) return user;

  const tempPassword = generateTempPassword();

  user = await User.create({
    email,
    passkey: tempPassword,
    role: "member",
    mustChangePassword: true,
  });

  try {
    sendTemporaryPassword(email, tempPassword);
  } catch (err) {
    console.error("Email failed:", err.message);
  }

  return user;
};

export const upsertMemberProfileService = async (userId, data) => {
  if (!userId) throw new Error("User ID is required");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  validateBasicInfo(data);

  let member;

  if (user.member_id) {
    member = await Member.findByIdAndUpdate(
      user.member_id,
      {
        ...data,
        address: {
          region: data.region,
          province: data.province,
          city: data.city,
          barangay: data.barangay,
        },
      },
      { new: true },
    );
  } else {
    member = await Member.create(buildMemberPayload(user, data));

    user.member_id = member._id;
    await user.save();
  }

  return {
    message: user.member_id
      ? "Member updated successfully"
      : "Profile created successfully",
    member,
    userId: user._id,
  };
};

export const getMembersService = async () => {
  const users = await User.find().populate("member_id").lean();

  return users.map((user) => {
    const member = user.member_id;

    return {
      // IDs
      user_id: user._id.toString(),
      member_id: member?._id?.toString() || null,

      // grouped data
      user: {
        email: user.email,
        role: user.role,
        is_enabled: user.is_enabled,
        mustChangePassword: user.mustChangePassword,
      },

      member: member || null,

      // (for table display)
      name: member
        ? [member.first_name, member.middle_name, member.last_name]
            .filter(Boolean)
            .join(" ")
        : "Incomplete Profile",

      contact_no: member?.contact_no || "N/A",
      status: member?.status || "incomplete",

      lastLogin: user.lastLogin
        ? new Date(user.lastLogin).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "Never Logged In",

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
};

export const getMemberByIdService = async (id) => {
  const member = await Member.findById(id);

  if (!member) {
    throw new Error("Member not found");
  }

  return member;
};

export const deleteMemberService = async (id) => {
  const member = await Member.findByIdAndDelete(id);

  if (!member) {
    throw new Error("Member not found");
  }

  await User.findOneAndDelete({ member_id: member._id });

  return { message: "Member and user deleted" };
};
