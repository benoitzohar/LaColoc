var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: true, // true
      actions: ['invite'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      //parseAppId: 'PARSE_APP_ID',
      //parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    url: 'http://localhost:3000',
    db: 'mongodb://localhost/lacoloc',
    root: rootPath,
    email: 'noreply@localhost',
    notifier: notifier,
    app: {
      name: 'laColoc'
    },
    facebook: {
      clientID: '132361146926151',
      clientSecret: 'e5c177219973b5400aad4598b518de4f',
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "cNlW8GiWlMnQ7LrVP9sMzQ",
      clientSecret: "f8y8kSkU8WbD4uOWqgnjbKqx689fG7skRd0hOlXUrI",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    google: {
      clientID: "789905100921.apps.googleusercontent.com",
      clientSecret: "fbiYLp4ejZnwOoVAqb8izsJX",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  test: {},
  production: {
     url: 'http://dev.lacoloc.fr',
      db: 'mongodb://localhost/lacoloc',
      root: rootPath,
      email: 'noreply@lacoloc.fr',
      notifier: notifier,
      app: {
        name: 'laColoc'
      },
      facebook: {
        clientID: '132361146926151',
        clientSecret: 'e5c177219973b5400aad4598b518de4f',
        callbackURL: "http://dev.lacoloc.fr/auth/facebook/callback"
      },
      twitter: {
        clientID: "cNlW8GiWlMnQ7LrVP9sMzQ",
        clientSecret: "f8y8kSkU8WbD4uOWqgnjbKqx689fG7skRd0hOlXUrI",
        callbackURL: "http://dev.lacoloc.fr/auth/twitter/callback"
      },
      google: {
        clientID: "789905100921.apps.googleusercontent.com",
        clientSecret: "fbiYLp4ejZnwOoVAqb8izsJX",
        callbackURL: "http://dev.lacoloc.fr/auth/google/callback"
      }

  }
}