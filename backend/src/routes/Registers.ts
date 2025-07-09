import { Router } from "express";
import { RegisterController } from "../controller/RegisterController";

const router = Router();

router.get('/', RegisterController.list);
router.post('/', RegisterController.insert);
router.put('/update/:id', RegisterController.update);
router.delete('/:id', RegisterController.delete);
router.get('/totais', RegisterController.calculateTotal);


export default router;