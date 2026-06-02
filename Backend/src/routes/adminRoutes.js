import express from "express";
import { loginAdmin, logoutAdmin, getCurrentAdmin } from "../controllers/adminAuthController.js";
import { getAllSupports, updateSupportStatus } from "../controllers/adminSupportController.js";
import { getAllWorkersForAdmin, updateWorkerDetailsForAdmin } from "../controllers/adminWorkerController.js";
import { getAllCustomersForAdmin, updateCustomerDetailsForAdmin } from "../controllers/adminCustomerController.js";
import { getAllRequestsForAdmin, updateRequestStatusForAdmin, generateOtpForAdmin } from "../controllers/adminRequestController.js";
import { verifyAuth, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public auth routes
router.post("/auth/login", loginAdmin);

// Protected routes (Admin only)
router.use(verifyAuth, isAdmin);

// Auth
router.post("/auth/logout", logoutAdmin);
router.get("/auth/me", getCurrentAdmin);

// Support queries
router.get("/support", getAllSupports);
router.put("/support/:id", updateSupportStatus);

// Workers
router.get("/workers", getAllWorkersForAdmin);
router.put("/workers/:id", updateWorkerDetailsForAdmin);

// Customers
router.get("/customers", getAllCustomersForAdmin);
router.put("/customers/:id", updateCustomerDetailsForAdmin);

// Service Requests
router.get("/requests", getAllRequestsForAdmin);
router.put("/requests/:id/status", updateRequestStatusForAdmin);
router.put("/requests/:id/otp", generateOtpForAdmin);

export default router;
