import {Router} from 'express'
import validateFields from "../middlewares/ValidateFields.js";
import {productCreateSchema, productUpdateSchema} from "../validations/Product.js";
import ProductController from "../controllers/ProductController.js";
const router = Router()

router.get('/', ProductController.index)
router.get('/:id', ProductController.show)
router.get('/:slug/detail', ProductController.productWithCategory)
router.post('/', validateFields(productCreateSchema), ProductController.store)
router.patch('/:id',validateFields(productUpdateSchema), ProductController.update)
router.delete('/:id', ProductController.destroy)

export default router