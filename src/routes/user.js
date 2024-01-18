import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';


const router = Router();
const { userController } = controllers;
const {
  authMiddleware
} = middlewares;

router.get("/dashboard",
  authMiddleware,
  userController.dashboard
);

router.delete("/remove-user/:userId",
  authMiddleware,
  userController.removeUser
);
export default router;