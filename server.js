const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './confi.env' });

const app = require('./app');

// console.log(app.get('env'));
// console.log(process.env);
const DBlocal = process.env.DATABASE_LOCAL;

mongoose.connect(DBlocal).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`app running at port ${port}`);
});
