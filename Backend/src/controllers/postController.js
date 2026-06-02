import Post from "../models/Post.js";
import Customer from "../models/Customer.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

// Helper for sanitizing Post data
const sanitizePost = (post, userRole) => {
    if (userRole === "worker") {
        delete post.category;
        delete post.status;
    }
    if (userRole === "customer")
        delete post.customer;

    delete post.pincode;
    delete post.__v;
    return post;
}

export const CreatePost = async (req, res, next) => {
    try {
        const { description, category, postImage } = req.body;
        const customerId = req.user._id;

        const newPost = await Post.create({
            customer: customerId,
            pincode: req.user.pincode,
            category,
            description,
            status: "pending",
            postImage: postImage || ""
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: newPost
        });

    } catch (error) {
        next(error);
    }
}

export const GetPost = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { userRole } = req;
        const query = {};

        if (userRole === "worker") {
            if (!req.user.isVerified) {
                return res.status(403).json({ success: false, message: "Account verification pending. You cannot view posts yet." });
            }
            query.status = "pending";
            query.pincode = req.user.pincode;
            query.category = req.user.occupation;
        } else if (userRole === "customer") {
            query.customer = req.user._id;
        }

        const totalPosts = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate("customer", "fullName profileImage phoneNumber subdivision")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const sanitizedPosts = posts.map(post => sanitizePost(post, userRole));

        return res.status(200).json({
            success: true,
            data: {
                posts: sanitizedPosts,
                pagination: {
                    total: totalPosts,
                    page,
                    limit,
                    totalPages: Math.ceil(totalPosts / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
}

export const UpdatePostDescription = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const post = await Post.findOne({ _id: id, customer: req.user._id });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found or unauthorized" });
        }

        post.description = description;
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Description updated successfully",
            data: post
        });

    } catch (error) {
        next(error);
    }
}

export const CompletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findOne({ _id: id, customer: req.user._id });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found or unauthorized" });
        }

        if (post.status === "completed") {
            return res.status(400).json({ success: false, message: "Post is already completed" });
        }

        post.status = "completed";
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post marked as completed",
            data: post
        });
    } catch (error) {
        next(error);
    }
}

export const DeletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findOne({ _id: id, customer: req.user._id });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found or unauthorized" });
        }

        if (post.postImage) {
            await deleteFromCloudinary(post.postImage);
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}
