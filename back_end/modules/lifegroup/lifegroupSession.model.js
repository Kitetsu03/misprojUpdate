import mongoose from "mongoose";

const lifeGroupSessionSchema = new mongoose.Schema(
  {
    lifegroup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeGroup",
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    topic: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    session_date: {
      type: Date,
      required: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

/* prevent duplicate session dates per group */
lifeGroupSessionSchema.index(
  { lifegroup_id: 1, session_date: 1 },
  { unique: true },
);

export const LifeGroupSession = mongoose.model(
  "LifeGroupSession",
  lifeGroupSessionSchema,
);
