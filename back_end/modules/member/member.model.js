import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    first_name: String,
    last_name: String,
    middle_name: String,
    suffix: String,
    birth_date: Date,
    marital_status: {
      type: String,
      enum: ["single", "married", "seperated", "widowed"],
    },

    sex: {
      type: String,
      enum: ["female", "male"],
    },

    contact_no: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

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

    network: {
      type: String,
      enum: ["Children", "KKB", "YAN", "Men", "Women"],
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

memberSchema.pre("save", function () {
  if (!this.birth_date || !this.sex) {
    return;
  }

  const today = new Date();

  let age = today.getFullYear() - this.birth_date.getFullYear();

  const monthDiff = today.getMonth() - this.birth_date.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < this.birth_date.getDate())
  ) {
    age--;
  }

  if (age >= 4 && age <= 12) {
    this.network = "Children";
  } else if (age >= 13 && age <= 22) {
    this.network = "KKB";
  } else if (age >= 23 && age <= 29) {
    this.network = "YAN";
  } else if (age >= 30) {
    this.network = this.sex === "male" ? "Men" : "Women";
  }

  next();
});

const Member = mongoose.model("Member", memberSchema);
export default Member;
