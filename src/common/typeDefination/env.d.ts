namespace NodeJS {
    interface ProcessEnv {


        //  DATABASE
        DB_PORT: number
        DB_HOST: string
        DB_NAME: string
        DB_USERNAME: string
        DB_PASSWORD: string

        // ZARINNPAL
        ZARINNPAL_VERIFY_URL: string
        ZARINNPAL_REQUEST_URL: string
        ZARINNPAL_GATEWAY_URL: string
        ZARINNPAL_MERCHANT_ID: string

    }
}