import mongoose from "mongoose";

const lifeGroupAttendanceSchema = new mongoose.Schema(
  {
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeGroupSession",
    },

    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },

    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },

    time_in: Date,
  },
  { timestamps: true },
);

export const LifeGroupAttendance = mongoose.model(
  "LifeGroupAttendance",
  lifeGroupAttendanceSchema,
);
