import {Schema,model} from 'mongoose'

//const mongoose = require('mongoose')

//const Schema = Schema

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: String
})

export default model('Category', CategorySchema)