import {Router} from 'express'
import OrderController from "../controllers/OrderController.js";
const router = Router()

router.get('/', OrderController.index)
router.get('/:order_number', OrderController.show)
router.post('/', OrderController.store)

export default router