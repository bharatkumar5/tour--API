const User = require('../model/usermodel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');

///

const filterObj = (obj, ...allowedField) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllusers = catchAsync(async (req, res) => {
  const users = await User.find();

  console.log(users);

  res.status(200).json({
    status: 'succes',

    result: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  console.log(req.requestTime);
  res.status(500).json({
    status: 'succes',
    time: req.requestTime,
    result: 'not define',
  });
};

exports.updateme = catchAsync(async (req, res, next) => {
  // 1) Create error if user POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for updates. please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Update user document
  const filteredbody = filterObj(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.user.id, filteredbody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getuser = (req, res) => {
  console.log(req.requestTime);
  res.status(500).json({
    status: 'succes',
    time: req.requestTime,
    result: 'not define',
  });
};

exports.updateuser = (req, res) => {
  console.log(req.requestTime);
  res.status(500).json({
    status: 'succes',
    time: req.requestTime,
    result: 'not define',
  });
};

exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'succes',
    time: req.requestTime,
    result: 'not define',
  });
};
