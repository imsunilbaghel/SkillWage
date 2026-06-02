import Support from "../models/Support.js";

export const createSupport = async (req, res, next) => {
    try {
        const { query, screenshot } = req.body;
        const { user, userRole } = req;


        const newSupport = await Support.create({
            user: user._id,
            userModel: userRole === "worker" ? "Worker" : "Customer",
            userName: user.fullName,
            userRole: userRole,
            userNumber: user.phoneNumber,
            query,
            screenshot: screenshot || "",
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Support request created successfully",
            data: newSupport
        });

    } catch (error) {
        next(error);
    }
};

export const getSupports = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { user } = req;

        const queryObj = { user: user._id };

        const totalSupports = await Support.countDocuments(queryObj);
        let supports = await Support.find(queryObj)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        supports = supports.map(support => {
            if (support.status === "resolved") {
                delete support.screenshot;
            }
            if (!support.statusMessage || support.statusMessage.trim() === "") {
                delete support.statusMessage;
            }
            return support;
        });

        return res.status(200).json({
            success: true,
            data: {
                supports,
                pagination: {
                    total: totalSupports,
                    page,
                    limit,
                    totalPages: Math.ceil(totalSupports / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
