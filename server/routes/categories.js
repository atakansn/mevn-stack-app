import {Router} from 'express'
import {categoryCreateSchema, categoryUpdateSchema} from '../validations/Category.js'
import validateFields from "../middlewares/ValidateFields.js";
import CategoryController from "../controllers/CategoryController.js";
const router = Router()

router.get('/paginate', CategoryController.withPaginate)
router.get('/:slug/products', CategoryController.categoryOfProducts)
router.get('/', CategoryController.index)
router.get('/:id', CategoryController.show)
router.post('/', validateFields(categoryCreateSchema), CategoryController.store)
router.patch('/:id', validateFields(categoryUpdateSchema), CategoryController.update)
router.delete('/:id', CategoryController.destroy)

export default router