import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        pincode: {
            type: String,
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['labour', 'electrician', 'plumber', 'mistri', 'painter', 'carpenter'],
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "completed"]
        },
        postImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", PostSchema);
export default Post;