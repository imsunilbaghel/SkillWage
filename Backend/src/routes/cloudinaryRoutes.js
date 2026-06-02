import { Router } from "express";
import { getSignature } from "../controllers/cloudinaryController.js";

const router = Router();

// GET /api/cloudinary/signature
router.get("/signature", getSignature);

export default router;
