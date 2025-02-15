import { Router } from "express";
import { sendOtp, verifyOtp,forgotPasswordOtp } from "../mail/sendOtp.js";
const router = Router();




router.post("/send-otp",sendOtp);
router.post("/verify-otp",verifyOtp);
router.post("/forgot-password-otp",forgotPasswordOtp);


export default router;