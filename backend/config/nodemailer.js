const axios = require("axios");
require("dotenv").config();

// ==============================
// 1️⃣ OTP Email Template
// ==============================
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

// ==============================
// 2️⃣ Core Brevo Sender
// ==============================
const sendBrevoEmail = async ({ to, subject, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "ParkOS", email: process.env.EMAIL_USER },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    // Log but never crash the server over email failure
    console.error("Email Error:", err.response?.data || err.message);
  }
};

// ==============================
// 3️⃣ Send OTP Email
// ==============================
const sendMail = async (to, otp) => {
  const template = otpTemplate(otp);
  await sendBrevoEmail({ to, subject: template.subject, html: template.html });
};

// ==============================
// 4️⃣ Password Reset Email
// ==============================
const sendPasswordResetEmail = async (to, resetLink, username) => {
  await sendBrevoEmail({
    to,
    subject: "Password Reset - ParkOS",
    html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>Hello ${username}</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

// ==============================
// 5️⃣ Export Functions
// ==============================
module.exports = {
  sendMail,
  sendPasswordResetEmail,
};