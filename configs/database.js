const mongoose = require("mongoose");
const configuration = require("./configuration");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(configuration().database.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error to connect db: ${err.message}`);
  }
};

module.exports = connectDB;
