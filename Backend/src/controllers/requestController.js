import ServiceRequest from "../models/ServiceRequest.js";
import Worker from "../models/Worker.js";

const sanitizeRequest = (request, userRole) => {
  if (!request) return null;

  if (userRole === "customer") {
    delete request.customer;
  } else if (userRole === "worker") {
    delete request.worker;
    delete request.rating;
    delete request.hasRated;
    delete request.serviceType;
  }
  if ((request.status === "rejected" || request.status === "pending") && userRole === "worker") {
    request.customer = { ...request.customer };
    delete request.customer.phoneNumber;
  }
  if (request.status !== "accepted" || userRole === "worker") {
    delete request.otp;
    delete request.otpExpiresAt;
  }
  delete request.__v;

  return request;
};

const getPopulatedAndSanitizedRequest = async (requestId, userRole) => {
  const request = await ServiceRequest.findById(requestId)
    .populate("customer", "fullName phoneNumber profileImage")
    .populate("worker", "fullName phoneNumber profileImage serviceCharge occupation")
    .lean();

  return sanitizeRequest(request, userRole);
};

// POST /api/requests
export const createRequest = async (req, res, next) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ success: false, message: "Worker ID is required" });
    }

    // Ensure only customers can create requests
    if (req.userRole !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can create requests" });
    }

    // Check if worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    // Check if there's already a pending or accepted request for this pair
    const existingRequest = await ServiceRequest.findOne({
      customer: req.user._id,
      worker: workerId,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: "You already have an active request with this worker" });
    }

    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      worker: workerId,
      status: "pending",
      serviceType: worker.occupation || "",
    });

    const populatedRequest = await getPopulatedAndSanitizedRequest(serviceRequest._id, req.userRole);

    return res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: { serviceRequest: populatedRequest }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/requests
export const getRequests = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const query = {};
    if (req.userRole === "customer") {
      query.customer = req.user._id;
    } else if (req.userRole === "worker") {
      query.worker = req.user._id;
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;
    const totalRequests = await ServiceRequest.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / limitNum);
    const requests = await ServiceRequest.find(query)
      .populate("customer", "fullName phoneNumber profileImage")
      .populate("worker", "fullName phoneNumber profileImage serviceCharge occupation")
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    const sanitizedRequests = requests.map(request => sanitizeRequest(request, req.userRole));

    return res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      count: sanitizedRequests.length,
      pagination: {
        totalRequests,
        page: pageNum,
        limit: limitNum,
        totalPages
      },
      data: { requests: sanitizedRequests }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/requests/:id/accept
export const acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.userRole !== "worker") {
      return res.status(403).json({ success: false, message: "Only workers can accept requests" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending requests can be accepted" });
    }

    request.status = "accepted";
    await request.save();

    const populatedRequest = await getPopulatedAndSanitizedRequest(request._id, req.userRole);

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      data: { request: populatedRequest }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/requests/:id/generate-otp
export const generateOTP = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.userRole !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can generate OTP" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "OTP can only be generated for accepted requests" });
    }

    const otp = request.generateOTP();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      data: { otp, expiresAt: request.otpExpiresAt }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/requests/:id/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (req.userRole !== "worker") {
      return res.status(403).json({ success: false, message: "Only workers can verify OTP" });
    }

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Request is not in accepted state" });
    }

    const isValid = request.verifyOTP(otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    request.status = "completed";
    await request.save();

    const populatedRequest = await getPopulatedAndSanitizedRequest(request._id, req.userRole);

    return res.status(200).json({
      success: true,
      message: "OTP verified. Request completed successfully.",
      data: { request: populatedRequest }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/requests/:id/rate
export const rateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (req.userRole !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can rate requests" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (request.status !== "completed") {
      return res.status(400).json({ success: false, message: "Only completed requests can be rated" });
    }

    if (request.hasRated) {
      return res.status(400).json({ success: false, message: "You have already rated this request" });
    }

    request.rating = rating;
    request.hasRated = true;
    await request.save();

    // Update worker's average rating
    const workerId = request.worker;
    const allWorkerRequests = await ServiceRequest.find({ worker: workerId, hasRated: true });

    if (allWorkerRequests.length > 0) {
      const totalRating = allWorkerRequests.reduce((sum, req) => sum + req.rating, 0);
      const averageRating = totalRating / allWorkerRequests.length;

      await Worker.findByIdAndUpdate(workerId, { averageRating });
    }

    const populatedRequest = await getPopulatedAndSanitizedRequest(request._id, req.userRole);

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: { request: populatedRequest }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/requests/:id/reject
export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.userRole !== "worker") {
      return res.status(403).json({ success: false, message: "Only workers can reject requests" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending requests can be rejected" });
    }

    request.status = "rejected";
    await request.save();

    const populatedRequest = await getPopulatedAndSanitizedRequest(request._id, req.userRole);

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      data: { request: populatedRequest }
    });
  } catch (error) {
    next(error);
  }
};
