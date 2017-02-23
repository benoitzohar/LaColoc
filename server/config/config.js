// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config()

const env = process.env

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongooseDebug: env.MONGOOSE_DEBUG,
  mongo: {
    host: env.MONGO_HOST,
    port: env.MONGO_PORT
  }
}

export default config
