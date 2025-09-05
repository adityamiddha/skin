const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Try to get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Otherwise, try to get token from cookies
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 3. If no token, block access
  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }

  // 4. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 5. Get user from decoded token
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 6. Attach user to request
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
