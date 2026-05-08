import { Attendance } from "./attendance.model.js";

// Fetch all attendance for a service
export const getAttendanceByService = async (service_id) => {
  return Attendance.find({ service_id })
    .populate("member_id", "first_name last_name network email status")
    .lean();
};

// Bulk save or update attendance
export const saveBulkAttendance = async (records) => {
  if (!Array.isArray(records)) throw new Error("Payload must be an array");

  const savedRecords = [];

  for (const record of records) {
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

  const filter = is_guest
    ? { service_id, is_guest: true, guest_name }
    : { service_id, member_id };

  return Attendance.findOneAndUpdate(
    filter,
    {
      $set: { status, time_in: status === "present" ? new Date() : null },
    },
    { upsert: true, returnDocument: "after" },
  );
};
