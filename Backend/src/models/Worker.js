import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const workerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    subdivision: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    serviceCharge: {
      type: Number,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    aadhaarImage: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      required: true,
      enum: ['labour', 'electrician', 'plumber', 'mistri', 'painter', 'carpenter'],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    statusMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save Hook: Hash password before saving
workerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Instance Method: Verify password
workerSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance Method: Generate JWT Access Token
workerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      phoneNumber: this.phoneNumber,
      fullName: this.fullName,
      role: "worker",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
