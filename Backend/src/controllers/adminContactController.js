import Contact from "../models/Contact.js";
export const getAllContactsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalContacts = await Contact.countDocuments({});

    res.status(200).json({
      success: true,
      contacts,
      currentPage: page,
      totalPages: Math.ceil(totalContacts / limit),
      totalContacts,
    });
  } catch (error) {
    console.error("Error in getAllContactsForAdmin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteContactForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error in deleteContactForAdmin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
