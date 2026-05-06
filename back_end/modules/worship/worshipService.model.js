import mongoose from "mongoose";

const worshipServiceSchema = new mongoose.Schema({
  service_date: Date,
});

export const WorshipService = mongoose.model(
  "WorshipService",
  worshipServiceSchema,
);

const attendanceSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorshipService",
  },

  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },

  time_in: Date,
});

export const Attendance = mongoose.model("Attendance", attendanceSchema);
