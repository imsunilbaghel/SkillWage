import Customer from "../models/Customer.js";

// GET /api/admin/customers
export const getAllCustomersForAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    const query = {};

    // Search by Name, Phone Number, or Email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalCustomers = await Customer.countDocuments(query);
    const totalPages = Math.ceil(totalCustomers / limitNum);

    // Get customers without password and __v, sorted by newest
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .select("-password -__v")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      pagination: {
        total: totalCustomers,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      data: { customers },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/customers/:id
export const updateCustomerDetailsForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      phoneNumber,
      email,
      address,
      pincode,
      subdivision,
      city,
      state,
    } = req.body;

    // Build update object based on what is provided
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (subdivision !== undefined) updateData.subdivision = subdivision;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;

    const customer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Customer details updated successfully",
      data: { customer },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A customer with this phone number or email already exists.",
      });
    }
    next(error);
  }
};
