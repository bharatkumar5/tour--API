const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'user must a have name'],
  },
  email: {
    type: String,
    require: [true, 'user must a have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  Photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Password must a have password'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'confirm password not entered'],
    validate: {
      // this only works on Save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password was modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field

  this.passwordConfirm = undefined;

  next();
});
// function for password verification  //
userSchema.methods.correctpass = async function (inputpass, userpass) {
  return await bcrypt.compare(inputpass, userpass);
};

//function check password change //
userSchema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    // console.log(this.passwordChangedAt, JWTtimestamp);
  }

  return false;
};

//

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(
    { resetToken },
    this.passwordResetToken,
    this.passwordResetExpires
  );

  return resetToken;
};

//check active user

userSchema.pre(/^find/, function (next) {
  // this points to the current query

  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
