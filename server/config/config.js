// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config()

const env = process.env

const config = {
  env: env.NODE_ENV,
  secret: env.SECRET,
  port: env.PORT,
  mongooseDebug: env.MONGOOSE_DEBUG,
  mongo_uri: env.MONGO_URI + ('test' === env.NODE_ENV ? '-test' : '')
}

export default config
