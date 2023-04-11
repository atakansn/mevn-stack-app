import {connectDB} from "./mongoose.js";
import {Logger} from "./logger.js";
import express from "./express.js";

export default async (expressInstance) => {
    await connectDB()

    await express(expressInstance)
    Logger.info('🚀 Express loaded')
}