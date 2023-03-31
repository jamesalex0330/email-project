import { Router } from 'express';
import controllers from '../controllers';


const router = Router();
const { mediaController } = controllers;

router.post('/uploadmedia', 
mediaController.uploadFile  
)
export default router;