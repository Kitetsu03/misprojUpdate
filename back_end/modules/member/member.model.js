import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // personal info
    first_name: String,
    last_name: String,
    middle_name: String,
    suffix: String,
    birth_date: Date,
    marital_status: {
      type: String,
      enum: ["single", "married", "divorced"],
    },

    sex: {
      type: String,
      enum: ["female", "male"],
    },

    // contact
    contact_no: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // address
    address: {
      province: String,
      city: String,
      barangay: String,
      region: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    is_enabled: {
      type: Boolean,
      default: false,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Member = mongoose.model("Member", memberSchema);
export default Member;
