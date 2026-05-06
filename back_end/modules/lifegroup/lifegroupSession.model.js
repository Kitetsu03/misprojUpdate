import mongoose from "mongoose";

const lifeGroupSessionSchema = new mongoose.Schema(
  {
    lifegroup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeGroup",
    },

    session_date: {
      type: Date,
      required: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const LifeGroupSession = mongoose.model(
  "LifeGroupSession",
  lifeGroupSessionSchema,
);
