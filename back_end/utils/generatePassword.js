import crypto from "crypto";

export const generateTempPassword = () => {
  return crypto.randomBytes(6).toString("base64").slice(0, 10);
};
