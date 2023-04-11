import winston from 'winston'
import appConfig from '../config/index.js'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = join(fileURLToPath(import.meta.url))

const transports = []

if (process.env.NODE_ENV !== 'development') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    )
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.simple(),
            level: 'info'
        }),
        new winston.transports.File({
            filename: join(__dirname, '../../', 'logs/app.log'),
            level: 'info'
        }),
    )
}

export const Logger = winston.createLogger({
    level: appConfig.LOGS.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.errors({stack: true}),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: {service: 'app_log'},
    transports

})