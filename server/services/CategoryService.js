import BaseService from "./BaseService.js";
import CategoryModel from '../models/Category.js'
import Category from "../models/Category.js";

class CategoryService extends BaseService {
    constructor() {
        super(CategoryModel);
    }
}

export default new CategoryService