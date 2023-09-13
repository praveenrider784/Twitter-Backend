const mongoose = require("mongoose");

const connectdb = (url,callback) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection Successful");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err; // Propagate the error up the chain
    });
};

module.exports = connectdb;
