import passport from 'passport'
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from 'passport-jwt'
import User from '../core/user/user.model'
import config from './config'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.secret
}

passport.use(new JwtStrategy(opts, (jwtPayload, next) => {
  User.findOne({
      id: jwtPayload.id
    })
    .then((user) => next(null, user || false))
    .catch((err) => next(err, false))
}))


export default passport
