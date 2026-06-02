import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "userModel",
            required: true,
        },
        userModel: {
            type: String,
            required: true,
            enum: ["Customer", "Worker"]
        },
        userName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            required: true,
            enum: ["customer", "worker"]
        },
        userNumber: {
            type: String,
            required: true,
        },
        query: {
            type: String,
            required: true,
        },
        screenshot: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "resolved"],
            default: "pending"
        },
        statusMessage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

const Support = mongoose.model("Support", SupportSchema);
export default Support;
