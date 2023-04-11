import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import appConfig from '../config/index.js'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import errorHandler from "../middlewares/ErrorHandler.js";
import session from 'express-session'
import {categoriesRoute,ordersRoute,cartRoute,productsRoute} from "../routes/index.js"
export default (app) => {

    app.use(helmet())
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    app.use(session({
        secret: appConfig.SESSION.SECRET,
        resave: appConfig.SESSION.RESAVE,
        saveUninitialized: appConfig.SESSION.SAVE_UNINITIALIZED,
        cookie: appConfig.SESSION.COOKIE.SECURE,

    }))

    app.use(cors({
        origin: appConfig.CORS.ORIGIN,
        credentials: appConfig.CORS.CREDENTIALS
    }))

    app.use(cookieParser())

    app.use(fileUpload({
        limits:{
            fileSize: 10 * 1024 * 1024,
            files: 1
        },
        limitHandler: function (req, res, next) {
            const error = new Error('Maksimum dosya boyutu veya sayısı aşıldı')
            error.status = 413
            next(error)
        },
    }))

    app.use('/categories',categoriesRoute)
    app.use('/products',productsRoute)
    app.use('/orders',ordersRoute)
    app.use('/cart',cartRoute)

    app.use((req, res, next) => {
        const error = new Error('Route Not Found')
        error.status = 404
        next(error)
    })

    app.use(errorHandler)
}