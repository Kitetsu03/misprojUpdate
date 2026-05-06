import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send temporary password to email
export const sendTemporaryPassword = async (to, tempPassword) => {
  try {
    const mailOptions = {
      from: `"JIL Church MIS" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Temporary Account Password",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Account Created</h2>
          <p>Your account has been created successfully.</p>

          <p><strong>Temporary Password:</strong></p>
          <div style="
            background: #f4f4f4;
            padding: 10px;
            font-size: 18px;
            letter-spacing: 2px;
            display: inline-block;
          ">
            ${tempPassword}
          </div>

          <p style="margin-top: 20px;">
            Please login and change your password immediately.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email failed:", error.message);
    throw error;
  }
};
