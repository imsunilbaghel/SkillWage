import { Router } from "express";
import { getWorkers } from "../controllers/workerController.js";
import { verifyAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", verifyAuth, getWorkers);

export default router;
