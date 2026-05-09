import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  login_time: {
    type: Date,
    default: Date.now,
  },
});

const LoginLog = mongoose.model("LoginLog", loginLogSchema);
export default LoginLog;
