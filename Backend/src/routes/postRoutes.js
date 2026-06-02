import { Router } from "express";
import { verifyAuth, isWorker, isCustomer } from "../middlewares/auth.js";
import { 
    CreatePost, 
    GetPost, 
    UpdatePostDescription, 
    CompletePost, 
    DeletePost 
} from "../controllers/postController.js";
import { validate } from "../middlewares/validate.js";
import { CreatePostSchema, UpdateDescriptionSchema } from "../validators/postValidator.js";


const router = Router();
router.use(verifyAuth);

router.post("/create", isCustomer, validate(CreatePostSchema), CreatePost);
router.get("/all-post", GetPost); // Accessed by both Worker and Customer
router.put("/update/:id", isCustomer, validate(UpdateDescriptionSchema), UpdatePostDescription);
router.patch("/status/:id", isCustomer, CompletePost);
router.delete("/delete/:id", isCustomer, DeletePost);

export default router;
