import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Route for user registration
router.route("/register").post(
   // using middleware in between for uploading images and avatar
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 2,
    }
  ]),

  registerUser
);

export default router;
