import { Router } from "express";
import controllers from "../controllers";
const router = Router();
const { accountController, attachmentController } = controllers;
console.log(1);
router.get("/attachment",
    accountController.getAuthorizationCode
);

router.post("/upload-csv",
attachmentController.uploadCsv
);

export default router;