const nodemailer = require("nodemailer");
require("dotenv").config();

// ==============================
// 1️⃣ Create Transporter
// ==============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASS,
  },
});

// ==============================
// 2️⃣ OTP Email Template
// ==============================
const otpTemplate = (otp) => ({
  subject: "OTP Verification - ParkOS",
  text: `Your OTP is ${otp}`,
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
// 3️⃣ Send OTP Email
// ==============================
const sendMail = async (to, otp) => {
  try {

    // console.log("otp ",otp);
    
    const template = otpTemplate(otp);

    const mailOptions = {
      from: `"SerchBy" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("OTP Email Sent:", result.messageId);

    return result;

  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

// ==============================
// 4️⃣ Password Reset Email
// ==============================
const sendPasswordResetEmail = async (to, resetLink, username) => {

  const mailOptions = {
    from: `"SerchBy" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Password Reset",
    html: `
      <h2>Hello ${username}</h2>
      <p>Click below to reset password</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ==============================
// 5️⃣ Export Functions
// ==============================
module.exports = {
  sendMail,
  sendPasswordResetEmail,
};