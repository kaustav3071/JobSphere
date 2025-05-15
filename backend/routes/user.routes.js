import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
import { body } from "express-validator";
import express from "express";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/resumes/",
  filename: (req, file, cb) => {
    cb(null, `resume-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const userRouter = express.Router();


userRouter.post(
  "/register",
  upload.single("resume"), 
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 }) 
    .withMessage("Password must be at least 8 characters long"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("resume").custom((value, { req }) => {
    if (!req.file) throw new Error("Resume file is required");
    return true;
  }),
  registerUser
);


userRouter.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  loginUser
);


userRouter.post("/logout", authenticateUser, logoutUser);


userRouter.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Invalid email format"),
  forgotPassword
);


userRouter.post(
  "/reset-password",
  body("token").notEmpty().withMessage("Token is required"),
  body("password") // Align with controller
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  resetPassword
);


userRouter.get("/profile", authenticateUser, getUserProfile);

export default userRouter;