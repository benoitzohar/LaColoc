var path = require('path'),
    fs = require('fs'),
    rootPath = path.normalize(__dirname + '/..'),
    templatePath = path.normalize(__dirname + '/../mailer/templates'),
    env = process.env.NODE_ENV || 'development',
    notifier = {
        service: 'postmark',
        APN: false,
        email: true, // true
        actions: ['invite'],
        tplPath: templatePath,
        key: 'POSTMARK_KEY',
        //parseAppId: 'PARSE_APP_ID',
        //parseApiKey: 'PARSE_MASTER_KEY'
    };

//default configs
let configFileName = rootPath + '/config.' + env + '.json'

if (!fs.existsSync(configFileName)) {
    throw ('Fatal: unable to find config file: ' + configFileName)
}

// read json config file
let confg = JSON.parse(fs.readFileSync(configFileName, 'utf8'))

if (!confg) {
    throw ('Fatal: unable to read config file: ' + configFileName)
}

//add propr configs
confg.root = rootPath;
confg.notifier = notifier;

module.exports = confg;
