import { Router } from "express";
import { RegisterController } from "../controller/RegisterController";

const router = Router();

router.get('/', RegisterController.list);
router.post('/', RegisterController.insert);
router.get('/totais', RegisterController.calculateTotal);

export default router;