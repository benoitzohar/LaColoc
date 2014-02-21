var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../mailer/templates')
  , env = process.env.NODE_ENV || 'development'
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

//default configs
var confg = {
  app: {
    name: 'laColoc'
  },
  url: 'http://localhost:3000',
  //db: 'mongodb://localhost/lacoloc',
  db:    'mongodb://lacoloc:vaL6vQJc@ds033079.mongolab.com:33079/lacoloc',
  root:  rootPath,
  email: 'noreply@localhost',
  notifier: notifier,
  facebook: {
    clientID: '132361146926151',
    clientSecret: 'e5c177219973b5400aad4598b518de4f',
    callbackURL: "https://localhost:3000/auth/facebook/callback"
  },
  twitter: {
    clientID: "cNlW8GiWlMnQ7LrVP9sMzQ",
    clientSecret: "f8y8kSkU8WbD4uOWqgnjbKqx689fG7skRd0hOlXUrI",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  google: {
    clientID: "737425887214.apps.googleusercontent.com",
    clientSecret: "p1lX_ahRnqYGEB76wopJv-cq",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  captcha: {
    pub: "6Ldzw-4SAAAAAAans1Cy_y87_fnSEOTvpFmKvPAQ",
    priv: "6Ldzw-4SAAAAAMZr7Ufwj5L1PmXhbzVMxRa3X34A"
  }
}

//configs depending on environnement
switch(env) {
  case 'HEROKULC':
    confg.url = 'https://lacoloc.herokuapp.com';
    confg.email = 'contact@lacoloc.fr';
    facebook.callbackURL = "https://lacoloc.herokuapp.com/auth/facebook/callback";
    twitter.callbackURL = "https://lacoloc.herokuapp.com/auth/twitter/callback";
    google.callbackURL = "https://lacoloc.herokuapp.com/auth/google/callback";
  break;
}

module.exports = confg;
 