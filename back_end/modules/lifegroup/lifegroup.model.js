import mongoose from "mongoose";

const lifeGroupSchema = new mongoose.Schema(
  {
    lifegroup_name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["homogenous", "heterogenous"],
      required: true,
    },

    gender_profile: {
      type: String,
      enum: ["men", "women"],
    },

    address: {
      type: String,
      trim: true,
    },

    contact_number: {
      type: String,
      trim: true,
    },

    host_name: {
      type: String,
      trim: true,
    },

    schedule: {
      type: String,
      trim: true,
    },

    opened_date: {
      type: Date,
      default: Date.now,
    },

    barangay: {
      type: String,
      trim: true,
    },

    district: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const LifeGroup = mongoose.model("LifeGroup", lifeGroupSchema);

// junction
const lifeGroupMemberSchema = new mongoose.Schema(
  {
    lifegroup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeGroup",
      required: true,
    },

    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    role: {
      type: String,
      enum: ["member"],
      default: "member",
    },

    joined_at: {
      type: Date,
      default: Date.now,
    },

    left_at: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

/* prevent duplicate active membership */
lifeGroupMemberSchema.index(
  { lifegroup_id: 1, member_id: 1 },
  { unique: true },
);

export const LifeGroupMember = mongoose.model(
  "LifeGroupMember",
  lifeGroupMemberSchema,
);

const lifeGroupLeaderSchema = new mongoose.Schema(
  {
    lifegroup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LifeGroup",
      required: true,
    },

    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    role: {
      type: String,
      enum: ["leader", "assistant_leader"],
      required: true,
    },

    started_at: {
      type: Date,
      default: Date.now,
    },

    ended_at: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const LifeGroupLeader = mongoose.model(
  "LifeGroupLeader",
  lifeGroupLeaderSchema,
);
