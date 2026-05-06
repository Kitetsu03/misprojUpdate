import mongoose from "mongoose";

const ministrySchema = new mongoose.Schema({
  ministry_name: String,
});

export const Ministry = mongoose.model("Ministry", ministrySchema);

const ministryMemberSchema = new mongoose.Schema({
  ministry_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ministry",
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
});

export const MinistryMember = mongoose.model(
  "MinistryMember",
  ministryMemberSchema,
);
