import {Schema,model} from 'mongoose'

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const OrderSchema = new Schema({
    order_number: Number,
    payment_method: String,
    billing_information: {
        address1: String,
        address2: String,
        country: String,
        city: String,
        zip: String
    },
    user: {
        firstName: String,
        lastName: String,
        email: String
    },
    products: [],
    totalPrice: Number
}, {timestamps: true, versionKey: false})

export default model('Order', OrderSchema)