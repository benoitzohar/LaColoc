/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Invite = mongoose.model('Invite'),
    Group = mongoose.model('Group'),
    utils = require('../lib/utils'),
    config = require('../config/config'),
    crypto = require('crypto'),
    socket = null;

//init the controller with the Socket.IO instance
exports.initController = function(sock) {
  socket = sock;
};

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var Group = mongoose.model('Group');

  Group.load(id)
    .then(function (group) {
      if (!group) return next(new Error('not found'));
      req.group = group;
      next();
    },
    function(err){
      return next(err || "Error loading the invite "+id);
    });
};

/**
 * send
 */

exports.send = function(req, res){
  console.log('Trying to send invite req=');  

  Group.load(req.user.current_group,function(err,group){
    if (err) res.render('500');
     //Generate code invite
    var code = crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');
    var invite = new Invite();
    invite.code = code;
    invite.email = req.body.email;
    invite.group = group;
    invite.save(function(err) {
      if (err) res.render('500');
       var mail = require("nodemailer").mail;
        var content = " Hello "+req.body.email+", \n"+req.user.name+" invited you to join lacoloc.\n Please use the link below:\n "+config.url+'/invite/valid?code='+code+"\n Alternatively, you can use this code : \n "+code+"\n Cheers";

        mail({
            from: config.email, // sender address
            to: req.body.email, // list of receivers
            subject: req.user.name + ' invited you to join his coloc', // Subject line
            text: content, // plaintext body
            html: content.replace(/\\n/g,"<br />") // html body
        })
        
         req.flash('info','The invitation was send')
         res.redirect('/')
    })
    //Send it to the provided email
  
  /*  var notify = require('../mailer');
    //if (!req.user.email) req.user.email = ''
    notify.invite({
      to_email: req.body.email,
      invite: this,
      currentUser: req.user,
      group: group,
      code : code
    },function(err) {
      if (err) {
          console.log(err);
          return res.render('500')
      }
      req.flash('info','The invitation was send')
      res.redirect('/')
      console.log('Successfully sent Notification!')
    })
*/

   
   })
}


/**
 * send
 */

exports.valid = function(req, res){
  var code = req.body.code || req.query.code;
  //console.log('Trying to valid invite rcode=',code);  
  if (!code) res.render('500');
  Invite.findOne({'code' : code, 'usedAt': null }).exec()
    .then(function(invite){
      return invite.use(req.user);
    })
    .then(function(){
      res.redirect('/');
    },
    function(err){
      console.error(err);
      return res.render('500');
    });
};
