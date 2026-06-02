import { Router } from "express";
import { submitContact } from "../controllers/contactController.js";
import { validate } from "../middlewares/validate.js";
import { contactSchema } from "../validators/contactValidator.js";

const router = Router();

// POST /api/contact
router.post("/", validate(contactSchema), submitContact);

export default router;
