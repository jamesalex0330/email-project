import { Router } from "express";

import controllers from "../controllers";
const router = Router();
const { gmailController } = controllers;


router.get('/messages', gmailController.messageList);

module.exports = router;