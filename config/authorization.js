/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

exports.hasGroup = function (req, res, next) {
  if (req.user.hasGroup()) {
    if (!req.user.current_group) {
        req.user.selectGroup(req.user.groups[0].group,function(){
          req.group = req.user.groups[0].group
          next()
        });
    }
    else {
      if (!req.group) req.group = req.user.current_group
      return next();
    }
  }
  res.redirect('/groups/new')
}


// User authorization routing middleware
exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/' + req.profile.id)
    }
    next()
  }
}


// Group authorization routing middleware
exports.group = {
  hasAuthorization: function (req, res, next) {
    console.log("req.group",req.group);
    if (!req.user.isInGroup(req.group._id)) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/groups/' + req.group.id)
    }
    next()
  }
}

/*
//Comment authorization routing middleware
exports.comment = {
  hasAuthorization: function (req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next()
    } else {
      req.flash('info', 'You are not authorized')
      res.redirect('/articles/' + req.article.id)
    }
  }
}
*/