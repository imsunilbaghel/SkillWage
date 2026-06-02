import ServiceRequest from "../models/ServiceRequest.js";
import Customer from "../models/Customer.js";
import Worker from "../models/Worker.js";

// GET /api/admin/requests
export const getAllRequestsForAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "all", search = "" } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    // Search by Customer or Worker Phone Number
    if (search) {
      // Find matching customers and workers by phone number
      const matchingCustomers = await Customer.find({ phoneNumber: { $regex: search, $options: "i" } }).select("_id").lean();
      const matchingWorkers = await Worker.find({ phoneNumber: { $regex: search, $options: "i" } }).select("_id").lean();
      
      const customerIds = matchingCustomers.map(c => c._id);
      const workerIds = matchingWorkers.map(w => w._id);

      // Add to query
      query.$or = [
        { customer: { $in: customerIds } },
        { worker: { $in: workerIds } }
      ];
    }

    const totalRequests = await ServiceRequest.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / limitNum);

    // Get requests, populate customer and worker
    const requests = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .populate("customer", "fullName phoneNumber")
      .populate("worker", "fullName phoneNumber")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Service requests fetched successfully",
      pagination: {
        total: totalRequests,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/requests/:id/status
export const updateRequestStatusForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const request = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("customer", "fullName phoneNumber")
     .populate("worker", "fullName phoneNumber");

    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/requests/:id/otp
export const generateOtpForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Service request not found." });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "OTP can only be generated for accepted requests." });
    }

    const otp = request.generateOTP();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully.",
      data: { otp, expiresAt: request.otpExpiresAt }
    });
  } catch (error) {
    next(error);
  }
};
