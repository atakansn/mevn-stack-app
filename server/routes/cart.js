import {Router} from 'express'
import CartController from "../controllers/CartController.js";
const router = Router()

router.get('/', CartController.index)
router.post('/', CartController.store)
router.post('/change', CartController.update)
router.post('/delete', CartController.destroy)

export default router