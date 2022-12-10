const express = require('express');
const Router = express.Router();
const usercontroller = require('../controller/usercontroller');
const authcontroller = require('../controller/authController');

Router.post('/signup', authcontroller.signup);
Router.post('/login', authcontroller.login);

Router.post('/forgotpassword', authcontroller.forgotPassword);
Router.patch('/resetpassword/:token', authcontroller.resetPassword);
Router.patch(
  '/updateMypassword',
  authcontroller.protect,
  authcontroller.updatePassword
);

Router.patch('/updateMe', authcontroller.protect, usercontroller.updateme);
Router.delete('/deleteMe', authcontroller.protect, usercontroller.deleteMe);

Router.route('/')
  .get(usercontroller.getAllusers)
  .post(usercontroller.createUser);

Router.route('/:id')
  .get(usercontroller.getuser)
  .patch(usercontroller.updateuser)
  .delete(usercontroller.deleteuser);

module.exports = Router;
