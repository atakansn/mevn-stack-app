import mongoose from 'mongoose'
import appConfig from '../config/index.js'
import {Logger} from "./logger.js";

mongoose.set('strictQuery', false)

export const connectDB = async () => {
    try{
        await mongoose.connect(`mongodb://${appConfig.DATABASE.HOST}:${appConfig.DATABASE.PORT}/${appConfig.DATABASE.NAME}`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        Logger.info('🚀 MongoDB loaded and connected')

    }catch (e){
        Logger.error(`😞 ${e}`)
    }
}