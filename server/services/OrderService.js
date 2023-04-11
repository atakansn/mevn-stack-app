import BaseService from "./BaseService.js";
import OrderModel from "../models/Order.js";

class OrderService extends BaseService {
    constructor() {
        super(OrderModel);
    }
}

export default new OrderService