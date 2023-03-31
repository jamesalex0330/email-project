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

export default router;