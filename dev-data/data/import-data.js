const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

const Tour = require('./../../model/tourmodel');
dotenv.config({ path: './confi.env' });

// console.log(app.get('env'));
// console.log(process.env);
const DBlocal = process.env.DATABASE_LOCAL;

mongoose.connect(DBlocal).then(() => console.log('DB connection successful!'));

//read json file//

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import data//

const importData = async () => {
  try {
    await Tour.create(tours);

    console.log('data loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data //

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
