import { Attendance } from "./attendance.model.js";
import User from "../account/user.model.js";
import Member from "../member/member.model.js";

export const getMembersService = async () => {
  const users = await User.find({ member_id: { $ne: null } })
    .populate("member_id")
    .lean();

  return users
    .map((user) => {
      const member = user.member_id;

      // Skip users without member_id
      if (!member) return null;

      return {
        // IDs
        user_id: user._id.toString(),
        member_id: member._id.toString(),

        // grouped data
        user: {
          email: user.email,
          role: user.role,
          is_enabled: user.is_enabled,
          mustChangePassword: user.mustChangePassword,
        },

        member,

        // (for table display)
        name: [member.first_name, member.middle_name, member.last_name]
          .filter(Boolean)
          .join(" "),

        contact_no: member.contact_no || "N/A",
        status: member.status || "inactive",
        network: member.network,

        lastLogin: user.lastLogin
          ? new Date(user.lastLogin).toLocaleString("en-PH", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "Never Logged In",

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    })
    .filter(Boolean);
};

// Fetch all attendance for a service
export const getAttendanceByService = async (service_id) => {
  // Get attendance records
  const attendance = await Attendance.find({ service_id })
    .populate("member_id", "first_name last_name network email status")
    .lean();

  // Get only members with complete profiles
  const users = await getMembersService();

  // Merge attendance
  const merged = users.map((user) => {
    const record = attendance.find(
      (a) => a.member_id?._id.toString() === user.member_id,
    );

    return {
      member_id: user.member_id,
      name: user.name,
      member: user.member,
      is_guest: false,
      status: record?.status || "absent",
    };
  });

  // Include guests from attendance
  const guestsFromAttendance = attendance
    .filter((a) => a.is_guest)
    .map((g) => ({
      _id: g._id,
      member_id: `guest-${g._id}`,
      name: g.guest_name,
      is_guest: true,
      status: g.status || "present",

      member: {
        status: "Visitor",
        network: "Guest",
      },
    }));

  return [...merged, ...guestsFromAttendance];
};

// Bulk save or update attendance
export const saveBulkAttendance = async (records) => {
  if (!Array.isArray(records)) throw new Error("Payload must be an array");

  const savedRecords = [];

  for (const record of records) {
    // Skip invalid member attendance
    if (!record.is_guest && !record.member_id) continue;

    // For members, make sure member exists
    if (!record.is_guest) {
      const memberExists = await Member.exists({ _id: record.member_id });
      if (!memberExists) continue; // skip invalid member
    }

    // Build filter for upsert
    const filter = record.is_guest
      ? {
          service_id: record.service_id,
          is_guest: true,
          guest_name: record.guest_name,
        }
      : { service_id: record.service_id, member_id: record.member_id };

    const saved = await Attendance.findOneAndUpdate(
      filter,
      {
        $set: {
          status: record.status,
          is_guest: record.is_guest || false,
          guest_name: record.guest_name || null,
          time_in: record.status === "present" ? new Date() : null,
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    savedRecords.push(saved);
  }

  return savedRecords;
};

// Toggle single attendance
export const toggleAttendance = async ({
  service_id,
  member_id,
  is_guest = false,
  guest_name,
  status,
}) => {
  if (!service_id) throw new Error("service_id is required");

  // Skip toggle if it's a member without a valid ID
  if (!is_guest && !member_id) {
    throw new Error("Cannot toggle attendance for a user without member_id");
  }

  // For members, check existence
  if (!is_guest) {
    const memberExists = await Member.exists({ _id: member_id });
    if (!memberExists) {
      throw new Error("Member not found");
    }
  }

  // Build the filter
  const filter = is_guest
    ? { service_id, is_guest: true, guest_name }
    : { service_id, member_id };

  // Perform the toggle
  const updatedRecord = await Attendance.findOneAndUpdate(
    filter,
    {
      $set: {
        status,
        time_in: status === "present" ? new Date() : null,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return updatedRecord;
};

// DELETE guest attendance
export const deleteGuestAttendance = async (attendanceId) => {
  const deleted = await Attendance.findByIdAndDelete(attendanceId);

  if (!deleted) {
    throw new Error("Guest attendance not found");
  }

  return {
    message: "Guest removed successfully",
  };
};
