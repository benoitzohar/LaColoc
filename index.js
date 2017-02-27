import mongoose from 'mongoose'
import util from 'util'

// config should be imported before importing any other file
import config from './server/config/config'
import app from './server/config/express'

const debug = require('debug')('lacoloc:index')

mongoose.Promise = Promise

// connect to mongo db
mongoose.connect(config.mongo_uri, {
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
})
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`)
})

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
  })
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`)
  })
}

export default app
