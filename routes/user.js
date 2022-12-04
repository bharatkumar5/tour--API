const express = require('express');
const Router = express.Router();
const usercontroller = require('../controller/usercontroller');

Router.route('/').get(usercontroller.getusers).post(usercontroller.createUser);

Router.route('/:id')
  .get(usercontroller.getuser)
  .patch(usercontroller.updateuser)
  .delete(usercontroller.deleteuser);

module.exports = Router;
