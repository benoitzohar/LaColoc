import APIError from '../../helpers/APIError';
import httpStatus from 'http-status';

const current = (req, res, next) => {
  //ensure the current user can only change things on
  //it's own object
  if (String(req.user._id) === String(req.routeUser._id)) {
    return next();
  } else {
    const err = new APIError(
      "You cannot target this user as it's not yourself.",
      httpStatus.BAD_REQUEST
    );
    return next(err);
  }
};

export default {
  current
};
