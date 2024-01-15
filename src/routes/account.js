import { Router } from "express";
import controllers from "../controllers";
import validations from "../validations";
import middlewares from "../middlewares";
const router = Router();
const { accountController } = controllers;
const { accountValidator } = validations;
const { validateMiddleware } = middlewares

router.post("/signup",
    validateMiddleware({ schema: accountValidator.userAccountSignupSchema }),
    accountController.signup
)
router.post("/login",
validateMiddleware({ schema: accountValidator.userAccountLoginSchema }),
    accountController.userAccountLogin
)
router.post("/forgot-password",
    validateMiddleware({ schema: accountValidator.sendOtpSchema }),
    accountController.sendOtp
)
router.post("/resend-otp",
    validateMiddleware({ schema: accountValidator.sendOtpSchema }),
    accountController.sendOtp
)
router.post("/verify-otp",
    validateMiddleware({ schema: accountValidator.verifyOtpSchema }),
    accountController.verifyOtp
)
router.get("/logout",
    authMiddleware,
    accountController.logout
)

export default router;