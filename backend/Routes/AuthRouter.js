import express from "express";
import { signupInit, verifyOtp, login } from "../Controllers/AuthController.js";
import { loginValidation, signupValidation } from "../Middlewares/AuthValidation.js";

const router = express.Router();

// Step 1: Signup Init (send OTP to email)
router.post("/signup-init", signupValidation, signupInit);

// Step 2: Verify OTP (create user after OTP verification)
router.post("/verify-otp", verifyOtp);

// Login Route
router.post("/login", loginValidation, login);

export default router;
