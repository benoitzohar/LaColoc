import passport from 'passport'
import {
  Strategy as JwtStrategy,
  ExtractJwt
} from 'passport-jwt'
import APIError from '../helpers/APIError'
import httpStatus from 'http-status'
import User from '../core/user/user.model'
import config from './config'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  ignoreExpiration: true,
  secretOrKey: config.secret
}

passport.use(new JwtStrategy(opts, (jwtPayload, next) => {
  User.findOne({
    id: jwtPayload.id
  })
  .then(user => next(null, user || false))
  .catch(err => next(new APIError(err, httpStatus.UNAUTHORIZED), false))
}))

//adds passport auth as a shortcut
passport.auth = () => passport.authenticate('jwt', { session: false })

export default passport
