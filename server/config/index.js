import dotEnv from "dotenv";

const checkEnv = dotEnv.config()

if (checkEnv.error) {
    throw new Error('⚠️ .env file not found.')
}

export default {
    APP: {
        NAME: process.env.APP_NAME || 'MEVN Stack Shopping Cart',

        PORT: process.env.APP_PORT || 3000,

        HOST_PREFIX: '/api',
    },

    DATABASE: {
        HOST: process.env.DB_HOST || '127.0.0.1',

        PORT: process.env.DB_PORT || '27017',

        NAME: process.env.DB_NAME,
    },

    LOGS: {
        level: process.env.LOG_LEVEL || 'silliy'
    },

    CORS: {
        ORIGIN: process.env.ORIGIN,

        CREDENTIALS: true,
    },


    S3: {
        ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,

        SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,

        BUCKET: process.env.S3_BUCKET,

        ACL: process.env.S3_ACL,
    },

    SESSION: {
        SECRET: process.env.SESSION_SECRET,

        RESAVE: false,

        SAVE_UNINITIALIZED: true,

        COOKIE: {
            SECURE: false
        },

        NAME: 'mevn_stack'
    },
}
