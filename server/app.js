import express from 'express'
import appConfig from "./config/index.js";
import {Logger} from "./loaders/logger.js";

const runApp = async () => {
    const app = express();

    await (await import('./loaders/index.js')).default(app)


    app.listen(appConfig.APP.PORT, async () => {

        Logger.info(`🚀 Server listening on port: ${appConfig.APP.PORT}`)

    }).on('error', err => {
        Logger.error(err)
        process.exit(1)
    })
}

runApp()