export default new class CartController {

    index(req, res, next) {
        let cart = req.session.cart || []

        let cardTotalPrice = 0.0
        cart.forEach(item => cardTotalPrice += item.totalPrice)

        return res.status(200).json({
            cart: req.session.cart,
            cardTotalPrice
        })
    }

    store(req, res, next) {
        let product = req.body.product
        let cart = req.session.cart || []

        let itemIndex = cart.findIndex(item => item._id === product._id)

        if (itemIndex > -1) {
            cart[itemIndex].count += req.body.count
            cart[itemIndex].totalPrice = cart[itemIndex].count * cart[itemIndex].price
        } else {
            cart.push({
                ...product,
                count: req.body.count,
                totalPrice: req.body.count * product.price
            })
        }

        let cardTotalPrice = 0
        cart.forEach(item => cardTotalPrice += item.totalPrice)

        req.session.cart = cart

        res.status(200).json({
            cart: req.session.cart,
            cardTotalPrice
        })
    }

    update(req, res, next) {
        let product = req.body.product
        let cart = req.session.cart || []

        let itemIndex = cart.findIndex(item => item._id === product._id)

        if (itemIndex > -1) {
            cart[itemIndex].count = +product.count
            cart[itemIndex].totalPrice = cart[itemIndex].count * cart[itemIndex].price
        } else {
            cart.push({
                ...product,
                count: +product.count,
                totalPrice: +product.count * +product.price
            })
        }

        let cardTotalPrice = 0
        cart.forEach(item => cardTotalPrice += item.totalPrice)

        req.session.cart = cart

        res.status(200).json({
            cart: req.session.cart,
            cardTotalPrice
        })
    }

    destroy(req, res, next) {
        let product = req.body.product
        let cart = req.session.cart || []

        let productIndex = cart.findIndex(item => item._id === product._id)

        if (productIndex > -1) {
            cart.splice(productIndex, 1)
            req.session.cart = cart
        }

        let cardTotalPrice = 0
        cart.forEach(item => cardTotalPrice += item.totalPrice)

        req.session.cart = cart

        res.status(200).json({
            cart: req.session.cart,
            cardTotalPrice
        })
    }

}