import Worker from "../models/Worker.js";
import Customer from "../models/Customer.js";
import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/worker/forgot-password
export const workerForgotPassword = async (req, res, next) => {
  try {
    const { phoneNumber, dateOfBirth, aadhaarNumber, newPassword } = req.body;

    const worker = await Worker.findOne({ phoneNumber });
    if (!worker) {
      return res.status(404).json({ success: false, message: "No worker account found with this phone number." });
    }

    // Verify date of birth
    const inputDob = new Date(dateOfBirth);
    const storedDob = new Date(worker.dateOfBirth);
    if (
      inputDob.getFullYear() !== storedDob.getFullYear() ||
      inputDob.getMonth() !== storedDob.getMonth() ||
      inputDob.getDate() !== storedDob.getDate()
    ) {
      return res.status(401).json({ success: false, message: "Date of birth does not match our records." });
    }

    // Verify Aadhaar number
    const cleanInput = aadhaarNumber.replace(/\D/g, "");
    if (cleanInput !== worker.aadhaarNumber) {
      return res.status(401).json({ success: false, message: "Aadhaar number does not match our records." });
    }

    // All verified — update password
    worker.password = newPassword;
    await worker.save(); // pre-save hook will hash it

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/customer/forgot-password/send-otp
export const customerForgotSendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      return res.status(404).json({ success: false, message: "No customer account found with this email." });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in DB (Upsert if exists)
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail({
      from: `"SkillWage" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SkillWage - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4338ca;">SkillWage Password Reset</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4338ca;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please check your inbox.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/customer/forgot-password/reset
export const customerForgotResetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const storedOtpDoc = await Otp.findOne({ email: email.toLowerCase() });
    if (!storedOtpDoc) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (Date.now() > storedOtpDoc.expiresAt.getTime()) {
      await Otp.deleteOne({ _id: storedOtpDoc._id });
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (storedOtpDoc.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    // OTP verified — update password
    const customer = await Customer.findOne({ email: email.toLowerCase() }).select("+password");
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    customer.password = newPassword;
    await customer.save(); // pre-save hook will hash it

    // Cleanup OTP
    await Otp.deleteOne({ _id: storedOtpDoc._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
