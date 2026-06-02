import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected"],
      default: "pending",
    },
    serviceType: {
      type: String,
      default: "",
    },
    otp: {
      type: String, // 6 digit OTP
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    hasRated: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Method to generate OTP
serviceRequestSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  this.otp = otp;
  // OTP valid for 10 minutes
  this.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return otp;
};

// Method to verify OTP
serviceRequestSchema.methods.verifyOTP = function (inputOtp) {
  if (!this.otp || !this.otpExpiresAt) return false;
  if (new Date() > this.otpExpiresAt) return false;
  return this.otp === inputOtp;
};

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
