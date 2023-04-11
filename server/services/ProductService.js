import BaseService from "./BaseService.js";
import ProductModel from "../models/Product.js";

class ProductService extends BaseService {
    constructor() {
        super(ProductModel);
    }
}

export default new ProductService