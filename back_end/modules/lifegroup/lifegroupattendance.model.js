import mongoose from "mongoose";

const lifeGroupAttendanceSchema = new mongoose.Schema(
  {
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeGroupSession",
      required: true,
    },

    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

    attendance_status: {
      type: String,
      enum: ["present", "absent"],
      default: "absent",
    },

    /* guest support */
    is_guest: {
      type: Boolean,
      default: false,
    },

    guest_name: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

// prevent duplicate attendance per session/member
lifeGroupAttendanceSchema.index(
  { session_id: 1, member_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      member_id: { $type: "objectId" },
    },
  },
);

export const LifeGroupAttendance = mongoose.model(
  "LifeGroupAttendance",
  lifeGroupAttendanceSchema,
);
