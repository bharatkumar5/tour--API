const fs = require('fs');
const { isError } = require('util');
const APIFeatures = require('../Utils/APIFeatures');
const Tour = require('./../model/tourmodel');

exports.aliastoptours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getalltour = async (req, res) => {
  try {
    //build query//
    // (1) filtering  //

    // const queryObj = { ...req.query };

    // const excludefields = ['page', 'sort', 'limit', 'fields'];

    // excludefields.forEach((el) => delete queryObj[el]);

    // console.log(req.query);

    //advance filtering ///
    //{diffiuclty: 'easy', duration: {$gte:5}}//

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // (2) Sorting

    // if (req.query.sort) {
    //   const sortby = req.query.sort.split(',').join(' ');
    //   console.log(sortby);
    //   query = query.sort(sortby);

    // } else {
    //   query = query.sort('-createAt');
    // }

    ///(3) field limiting

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    ///(4) pagination
    // page=3 & limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('this page does not exist');
    // }

    //execute query//
    console.log('hi', req.query);

    const feature = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .paginate();
    const tours = await feature.query;

    // const alltours = await Tour.find({ duration: 5, difficulty: 'easy' });

    // const alltours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //send response//

    res.status(200).json({
      status: 'succes',

      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', msg: 'not found' });
  }
};

exports.createtour = async (req, res) => {
  try {
    const newtour = await Tour.create(req.body);

    res.status(201).json({
      status: 'succes',
      data: {
        tour: newtour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.gettour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'succes',

      data: {
        tours: tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', msg: 'not found' });
  }
};

exports.updatetour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', msg: 'not found' });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', msg: 'not found' });
  }
};

exports.gettourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },

      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: 'easy' } } },
    ]);

    res.status(200).json({
      status: 'succes',

      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', msg: 'not found' });
  }
};

exports.getmonthlyplan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },

      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: 'succes',

      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', msg: 'not found' });
  }
};
