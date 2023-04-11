import OrderService from "../services/OrderService.js";

export default new class OrderController {

    index(req, res, next) {
        OrderService.get()
            .then(response => res.status(200).json(response))
            .catch(err => next(err))
    }

    store(req, res, next) {
        OrderService.create({
            order_number: Date.now(),
            payment_method: req.body.order.payment_method,
            billing_information: req.body.order.billing_information,
            user: req.body.order.user,
            products: req.body.order.products,
            totalPrice: req.body.order.totalPrice
        }).then(response => {
                req.session.destroy()
                res.status(200).json(response)
            }).catch(err => next(err))
    }

    show(req, res, next) {
        OrderService.findOne({order_number: req.params.order_number})
            .then(response => res.status(200).json(response))
            .catch(err => next(err))
    }
}