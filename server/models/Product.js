import {Schema,model} from 'mongoose'

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    sku: String,
    slug: String,
    description: String,
    image: String,
    price: Number
})

export default model('Product', ProductSchema)