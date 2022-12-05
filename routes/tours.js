const express = require('express');

const tourcontroller = require('../controller/tourcontroller');

const Router = express.Router();

// Router.param('id', tourcontroller.checkid);

Router.route('/top-5-cheap').get(
  tourcontroller.aliastoptours,
  tourcontroller.getalltour
);

Router.route('/tour-stats').get(tourcontroller.gettourStats);
Router.route('/monthly-plan/:year').get(tourcontroller.getmonthlyplan);

Router.route('/')
  .get(tourcontroller.getalltour)
  .post(tourcontroller.createtour);

Router.route('/:id')
  .get(tourcontroller.gettour)
  .patch(tourcontroller.updatetour)
  .delete(tourcontroller.deleteTour);

// .delete(deletetour);

module.exports = Router;
