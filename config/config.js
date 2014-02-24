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
  locale: 'fr',
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
  },
  socket_transports : ['websocket','jsonp-polling', 'xhr-polling'],
  date_format : 'dd/mm/yyyy'
}

//configs depending on environnement
switch(env) {
  case 'HEROKULC':
    confg.locale = 'fr';
    confg.url = 'https://lacoloc.herokuapp.com';
    confg.db =  'mongodb://lacoloc:vaL6vQJc@ds033079.mongolab.com:33079/lacoloc';
    confg.email = 'contact@lacoloc.fr';
    confg.facebook.callbackURL = "https://lacoloc.herokuapp.com/auth/facebook/callback";
    confg.twitter.callbackURL = "https://lacoloc.herokuapp.com/auth/twitter/callback";
    confg.google.callbackURL = "https://lacoloc.herokuapp.com/auth/google/callback";
    break;
  case 'HEROKUFB':
    confg.locale = 'en';
    confg.url = 'http://www.flatbuddy.eu';
    confg.db =  'mongodb://flatbuddy:vaL6vQJc@ds031329.mongolab.com:31329/flatbuddy';
    confg.email = 'contact@flatbuddy.eu';
    confg.facebook =  {
      clientID: '614809568598903',
      clientSecret: 'c6e171b47cce427b8ccd56a1c1e1f1e0',
      callbackURL: "https://www.flatbuddy.eu/auth/facebook/callback",
      canvasCallbackURL: "https://apps.facebook.com/flatbuddy_eu",
    }
    confg.twitter.callbackURL = "http://www.flatbuddy.eu/auth/twitter/callback";
    confg.google.callbackURL = "https://www.flatbuddy.eu/auth/google/callback";
    confg.socket_transports = ['xhr-polling','jsonp-polling','websocket'];
    confg.date_format = 'mm/dd/yyyy';
    break;
  case 'KIMSLC':
    confg.locale = 'fr';
    confg.url = 'http://www.lacoloc.fr';
    confg.db =  'mongodb://lacoloc:vaL6vQJc@ds033079.mongolab.com:33079/lacoloc';
    confg.email = 'contact@lacoloc.fr';
    confg.facebook.callbackURL = "https://www.lacoloc.fr/auth/facebook/callback";
    confg.facebook.canvasCallbackURL = "https://apps.facebook.com/lacoloc";
    confg.twitter.callbackURL = "http://www.lacoloc.fr/auth/twitter/callback";
    confg.google.callbackURL = "http://www.lacoloc.fr/auth/google/callback";
    confg.socket_transports = ['websocket','xhr-polling','jsonp-polling'];
    confg.date_format = 'dd/mm/yyyy';
    confg.socket_transports = ['xhr-polling','jsonp-polling','websocket'];
    confg.captcha = {
      pub: "6Ldww-4SAAAAAB-0qBTIdY0KWAJsZCYFyejuuQiL",
      priv: "6Ldww-4SAAAAAJtUrWZP6Vd_Pex3gu9_PjWljdHY"
    }

    break;
  case 'KIMSLCDEV':

    break;

  case 'deven':
    confg.locale = 'en';
    confg.localized_url = {
      en: "http://google.com/",
      fr: "http://facebook.com/"
    }
    confg.date_format = 'mm/dd/yyyy';
    break;
}

module.exports = confg;
 