const configuration = require("./configs/configuration");

const express = require("express");
const io = require("socket.io");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectDB = require("./configs/database");
connectDB();

const router = require("./routers");
router(app);

const PORT = configuration().port;
const server = app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
