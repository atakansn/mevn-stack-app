import Joi from 'joi'

const orderCreateSchema = Joi.object({
    order:{
        order_number: Joi.number(),
        payment_method: Joi.string(),
        billing_information: {
            address1: Joi.string().required(),
            address2: Joi.string(),
            country: Joi.string().required(),
            city: Joi.string().required(),
            zip: Joi.number().required()
        },
        user:{
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required()
        },
        products: Joi.array(),
        totalPrice: Joi.number()
    }
});


export {
    orderCreateSchema
}
