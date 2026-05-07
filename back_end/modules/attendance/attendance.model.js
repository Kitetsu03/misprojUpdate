import mongoose from "mongoose";
import { WorshipService } from "../worship/worshipService.model.js";

const attendanceSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorshipService",
      required: true,
    },

    // MEMBER (optional for guests)
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },

    is_guest: {
      type: Boolean,
      default: false,
    },

    guest_name: {
      type: String,
      trim: true,
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

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

/* Prevent duplicate MEMBER attendance */
attendanceSchema.index(
  { service_id: 1, member_id: 1 },
  {
    unique: true,
    partialFilterExpression: { member_id: { $exists: true } },
  },
);

/* Validation: ensure either member OR guest is provided */
attendanceSchema.pre("validate", function (next) {
  if (!this.member_id && !this.is_guest) {
    return next(
      new Error("Attendance must have a member or be marked as guest."),
    );
  }

  if (this.is_guest && !this.guest_name) {
    return next(new Error("Guest name is required for guest attendance."));
  }

  next();
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
