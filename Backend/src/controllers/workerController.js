import Worker from "../models/Worker.js";
import ServiceRequest from "../models/ServiceRequest.js";

// GET /api/workers
export const getWorkers = async (req, res, next) => {
  try {
    const { occupation = "labour", pincode, sort = "rating_high", id: customerId, page = 1, limit = 10 } = req.query;

    if (!pincode) {
      return res.status(400).json({ success: false, message: "Pincode is required" });
    }

    if (!customerId) {
      return res.status(400).json({ success: false, message: "Customer ID is required" });
    }

    const query = {
      occupation,
      pincode,
      isVerified: true
    };

    // Set up sorting
    let sortOptions = {};
    if (sort === "charge_low") {
      sortOptions.serviceCharge = 1;
    } else if (sort === "charge_high") {
      sortOptions.serviceCharge = -1;
    } else if (sort === "rating_low") {
      sortOptions.averageRating = 1;
    } else if (sort === "rating_high") {
      sortOptions.averageRating = -1;
    } else {
      // Default sort (e.g. newest first)
      sortOptions.createdAt = -1;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Get total count of workers matching query
    const totalWorkers = await Worker.countDocuments(query);
    const totalPages = Math.ceil(totalWorkers / limitNum);

    const workers = await Worker.find(query)
      .sort(sortOptions)
      .skip(skipNum)
      .limit(limitNum)
      .select("-password -__v -dateOfBirth -aadhaarNumber -aadhaarImage -isVerified -createdAt -updatedAt -statusMessage")
      .lean();

    const workerIds = workers.map(worker => worker._id);
    // Fetch all requests for this customer sorted by newest first
    let customerRequests = [];
    if (customerId) {
      customerRequests = await ServiceRequest.find({
        customer: customerId,
        worker: { $in: workerIds }
      }).sort({ createdAt: -1 }).lean();
    }

    // Attach request info to each worker
    const enrichedWorkers = workers.map((worker) => {
      // Find the absolutely newest request for this specific worker
      const latestReq = customerRequests.find(
        (r) => r.worker.toString() === worker._id.toString()
      );

      // Check if that latest request is currently active
      const isActive = latestReq && ["pending", "accepted"].includes(latestReq.status);

      return {
        ...worker,
        serviceRequestStatus: isActive ? latestReq.status : null,
        serviceRequestDate: isActive ? latestReq.createdAt : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Workers fetched successfully",
      count: enrichedWorkers.length,
      pagination: {
        total: totalWorkers,
        page: pageNum,
        limit: limitNum,
        totalPages
      },
      data: { workers: enrichedWorkers },
    });
  } catch (error) {
    next(error);
  }
};
