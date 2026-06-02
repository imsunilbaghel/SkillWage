import { Router } from "express";
import {
  createRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  generateOTP,
  verifyOTP,
  rateRequest
} from "../controllers/requestController.js";
import { verifyAuth, isWorker, isCustomer } from "../middlewares/auth.js";

const router = Router();

router.use(verifyAuth);

router.post("/", isCustomer, createRequest);
router.get("/", getRequests);
router.patch("/:id/accept", isWorker, acceptRequest);
router.patch("/:id/reject", isWorker, rejectRequest);
router.post("/:id/generate-otp", isCustomer, generateOTP);
router.post("/:id/verify-otp", isWorker, verifyOTP);
router.post("/:id/rate", isCustomer, rateRequest);

export default router;
