import mongoose from "mongoose";

// WORSHIP SERVICE
const worshipServiceSchema = new mongoose.Schema(
  {
    service_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const WorshipService = mongoose.model(
  "WorshipService",
  worshipServiceSchema,
);

// ATTENDANCE
const attendanceSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorshipService",
      required: true,
    },

    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },

    time_in: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
