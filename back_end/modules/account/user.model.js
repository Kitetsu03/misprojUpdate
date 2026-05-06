import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },

    email: {
      type: String,
      unique: true,
    },

    passkey: String,

    role: {
      type: String,
      enum: ["admin", "gatekeeper", "member"],
      required: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    is_enabled: {
      type: Boolean,
      default: true,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("passkey") || !this.passkey) return;

  const salt = await bcrypt.genSalt(10);
  this.passkey = await bcrypt.hash(this.passkey, salt);
});
const User = mongoose.model("User", userSchema);
export default User;
