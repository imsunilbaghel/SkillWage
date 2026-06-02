import { Router } from "express";
import { verifyAuth, isWorker } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  updatePersonalSchema,
  updateAddressSchema,
  updateServiceChargeSchema,
  updatePasswordSchema
} from "../validators/profileValidator.js";
import {
  updatePersonalDetails,
  updateProfileImage,
  updateAddressDetails,
  updateServiceCharge,
  updatePassword
} from "../controllers/profileController.js";

const router = Router();

// All profile routes require authentication
router.use(verifyAuth);

router.put("/personal", validate(updatePersonalSchema), updatePersonalDetails);
router.put("/image", updateProfileImage);
router.put("/address", validate(updateAddressSchema), updateAddressDetails);
router.put("/service-charge", isWorker, validate(updateServiceChargeSchema), updateServiceCharge);
router.put("/password", validate(updatePasswordSchema), updatePassword);

export default router;
