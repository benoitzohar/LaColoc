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
  db: 'mongodb://localhost/lacoloc',
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
    confg.db =  'mongodb://lacoloc:vaL6vQJc@ds033079.mongolab.com:33079/lacoloc';
    confg.email = 'contact@lacoloc.fr';
    confg.facebook.callbackURL = "https://lacoloc.herokuapp.com/auth/facebook/callback";
    confg.twitter.callbackURL = "https://lacoloc.herokuapp.com/auth/twitter/callback";
    confg.google.callbackURL = "https://lacoloc.herokuapp.com/auth/google/callback";
    break;
  case 'HEROKUFB':
    confg.url = 'https://flat-buddy.herokuapp.com';
    confg.db =  'mongodb://flatbuddy:vaL6vQJc@ds031329.mongolab.com:31329/flatbuddy';
    confg.email = 'contact@flatbuddy.eu';
    confg.facebook.callbackURL = "https://flat-buddy.herokuapp.com/auth/facebook/callback";
    confg.twitter.callbackURL = "https://flat-buddy.herokuapp.com/auth/twitter/callback";
    confg.google.callbackURL = "https://flat-buddy.herokuapp.com/auth/google/callback";
    break;
}

module.exports = confg;
 