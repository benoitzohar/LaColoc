var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
 /* , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }
*/
module.exports = {
  development: {
    url: 'http://localhost:3000'
    db: 'mongodb://localhost/lacoloc',
    root: rootPath,
    //notifier: notifier,
    app: {
      name: 'laColoc'
    },
    facebook: {
      clientID: '132361146926151',
      clientSecret: 'e5c177219973b5400aad4598b518de4f',
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  test: {},
  production: {}
}