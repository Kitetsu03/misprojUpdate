import LoginLog from "./loginlogs.model.js";

export const logLogin = async (user_id) => {
  try {
    await LoginLog.create({ user_id });

    await User.findByIdAndUpdate(user_id, {
      lastLogin: new Date(),
    });
  } catch (err) {
    console.error(err);
  }
};
