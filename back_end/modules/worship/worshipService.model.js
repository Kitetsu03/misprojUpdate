import mongoose from "mongoose";

const worshipServiceSchema = new mongoose.Schema(
  {
    service_date: {
      type: Date,
      required: true,
      set: (val) => {
        const d = new Date(val);
        d.setHours(0, 0, 0, 0);
        return d;
      },
    },

    title: {
      type: String,
      trim: true,
      enum: [
        "Sunday Service",
        "Youth Service",
        "Prayer Meeting",
        "Special Service",
      ],
      default: "Sunday Service",
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      enum: ["8:00 AM", "10:00 AM", "3:00 PM", "6:00 PM"],
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

/* Prevent duplicate */
worshipServiceSchema.index(
  { service_date: 1, title: 1, time: 1, location: 1 },
  { unique: true },
);

export const WorshipService = mongoose.model(
  "WorshipService",
  worshipServiceSchema,
);
