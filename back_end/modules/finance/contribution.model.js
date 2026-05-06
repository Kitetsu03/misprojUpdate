import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },

  type: {
    type: String,
    enum: ["tithe", "offering", "mission", "pledge"],
  },

  amount: Number,
  date_given: Date,
});

const Contribution = mongoose.model("Contribution", contributionSchema);
export default Contribution;
