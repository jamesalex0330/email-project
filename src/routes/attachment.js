import { Router } from "express";
import controllers from "../controllers";
const router = Router();
const { accountController } = controllers;

router.post("/attachment",    
    accountController.attachment
);
export default router;