import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateResume
} from "../controllers/user.controller.js";
import { verifyEmail } from "../controllers/email.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
import { body } from "express-validator";
import express from "express";
import { upload } from "../controllers/user.controller.js"; // Import from user.controller.js

const userRouter = express.Router();

userRouter.post(
  "/register",
  upload,
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  registerUser
);

userRouter.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  loginUser
);


userRouter.get("/logout", authenticateUser, logoutUser);


userRouter.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Invalid email format"),
  forgotPassword
);


userRouter.post(
  "/reset-password/:token",
  body("password") // Align with controller
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  resetPassword
);


userRouter.get("/profile", authenticateUser, getUserProfile);

userRouter.get("/verify-email/:token", verifyEmail);

userRouter.put(
  "/update-resume",
  authenticateUser,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        // Multer error
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateResume
);

export default userRouter;