import express from "express";
import { createSupport, getSupports } from "../controllers/supportController.js";
import { verifyAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { CreateSupportSchema } from "../validators/supportValidator.js";

const router = express.Router();

router.use(verifyAuth);

router.post("/", validate(CreateSupportSchema), createSupport);
router.get("/", getSupports);

export default router;
