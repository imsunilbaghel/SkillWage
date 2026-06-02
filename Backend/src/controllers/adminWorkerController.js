import Worker from "../models/Worker.js";

// GET /api/admin/workers
export const getAllWorkersForAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", isVerified } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const query = {};

    // Filter by verification status
    if (isVerified === "true") query.isVerified = true;
    if (isVerified === "false") query.isVerified = false;

    // Search by Name, Aadhaar, or Phone Number
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { aadhaarNumber: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const totalWorkers = await Worker.countDocuments(query);
    const totalPages = Math.ceil(totalWorkers / limitNum);

    // Get workers without password and __v, sorted by newest
    const workers = await Worker.find(query)
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .select("-password -__v")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Workers fetched successfully",
      pagination: {
        total: totalWorkers,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      data: { workers },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/workers/:id
export const updateWorkerDetailsForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phoneNumber,
      aadhaarNumber,
      dateOfBirth,
      gender,
      address,
      pincode,
      subdivision,
      city,
      state,
      serviceCharge,
      occupation,
      isVerified,
      statusMessage,
    } = req.body;

    // Build update object based on what is provided
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (aadhaarNumber !== undefined) updateData.aadhaarNumber = aadhaarNumber;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (subdivision !== undefined) updateData.subdivision = subdivision;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (serviceCharge !== undefined) updateData.serviceCharge = serviceCharge;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (statusMessage !== undefined) updateData.statusMessage = statusMessage;

    const worker = await Worker.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Worker details updated successfully",
      data: { worker },
    });
  } catch (error) {
    // Handle uniqueness errors (e.g. phone or aadhaar already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A worker with this phone number or Aadhaar number already exists.",
      });
    }
    next(error);
  }
};
