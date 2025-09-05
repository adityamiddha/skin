const User = require('./../models/userModel');
const { createToken } = require('./../../utils/jwtUtils');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

// UPDATE PASSWORD
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isCorrect = await user.correctPassword(currentPassword, user.password);
  if (!isCorrect) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    message: 'Password updated successfully'
  });
});

// GET LOGGED-IN USER
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// UPDATE PROFILE
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError('This route is not for password updates. Use /updateMyPassword.', 400)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});