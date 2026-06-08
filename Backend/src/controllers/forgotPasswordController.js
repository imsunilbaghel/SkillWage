import Worker from "../models/Worker.js";
import Customer from "../models/Customer.js";
import Otp from "../models/Otp.js";
import { transporter } from "../config/nodemailer.js";
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background-color: #0f172a; padding: 25px; text-align: center; border-bottom: 4px solid #3b82f6;">
            <img src="https://skillwage.vercel.app/image/Skillwage.png" alt="SkillWage Logo" style="max-height: 55px;" />
          </div>
          <div style="padding: 30px; background-color: #ffffff; text-align: center;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Password Reset</h2>
            <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">You have requested to reset your password. Please use the One-Time Password (OTP) below to proceed.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px dashed #cbd5e1; display: inline-block; min-width: 200px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3b82f6;">${otp}</span>
            </div>
            
            <p style="color: #ef4444; font-size: 14px; margin-top: 25px; font-weight: 500;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #e2e8f0;">
            If you did not request a password reset, please ignore this email or contact support.<br/><br/>
            &copy; ${new Date().getFullYear()} SkillWage. All rights reserved.
          </div>
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
