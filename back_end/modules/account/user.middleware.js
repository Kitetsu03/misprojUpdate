import bcrypt from "bcrypt";

userSchema.pre("save", async function (next) {
  if (!this.isModified("passkey")) return next();

  try {
    this.passkey = await bcrypt.hash(this.passkey, 10);
    next();
  } catch (err) {
    next(err);
  }
});
