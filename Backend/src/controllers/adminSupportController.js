import Support from "../models/Support.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

// GET /api/admin/support
export const getAllSupports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    const queryObj = {};

    if (status && status !== "all") {
      queryObj.status = status;
    }

    if (search) {
      // Search by phone number
      queryObj.userNumber = { $regex: search, $options: "i" };
    }

    const totalSupports = await Support.countDocuments(queryObj);
    const supports = await Support.find(queryObj)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        supports,
        pagination: {
          total: totalSupports,
          page,
          limit,
          totalPages: Math.ceil(totalSupports / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/support/:id
export const updateSupportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, statusMessage } = req.body;

    const support = await Support.findById(id);

    if (!support) {
      return res.status(404).json({
        success: false,
        message: "Support query not found",
      });
    }

    let screenshotUrl = support.screenshot;

    support.status = status || support.status;
    support.statusMessage = statusMessage !== undefined ? statusMessage : support.statusMessage;

    if (status === "resolved" && screenshotUrl) {
      await deleteFromCloudinary(screenshotUrl);
      support.screenshot = "";
    }

    await support.save();

    return res.status(200).json({
      success: true,
      message: "Support query updated successfully",
      data: support,
    });
  } catch (error) {
    next(error);
  }
};
