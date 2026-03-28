const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const otpTemplate = (otp) => ({
  subject: "OTP Verification - ParkOS",
  html: `
    <div style="font-family: Arial; padding:20px;">
      <h2>Email Verification</h2>
      <p>Your OTP for verification is:</p>
      <h1 style="letter-spacing:5px;color:#4CAF50;">${otp}</h1>
      <p>This OTP will expire in 30 minutes.</p>
    </div>
  `,
});

const sendMail = async (to, otp) => {
  try {
    const template = otpTemplate(otp);

    const result = await resend.emails.send({
      from: "SerchBy <onboarding@resend.dev>", // use this until you verify a domain
      to: to,
      subject: template.subject,
      html: template.html,
    });

    console.log("OTP Email Sent:", result.id);
    return result;

  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

const sendPasswordResetEmail = async (to, resetLink, username) => {
  try {
    const result = await resend.emails.send({
      from: "SerchBy <onboarding@resend.dev>",
      to: to,
      subject: "Password Reset",
      html: `
        <h2>Hello ${username}</h2>
        <p>Click below to reset password</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });
    return result;
  } catch (error) {
    console.error("Reset Email Error:", error);
    throw error;
  }
};

module.exports = { sendMail, sendPasswordResetEmail };