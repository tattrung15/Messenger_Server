const configuration = require("./configs/configuration");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const chatServer = require("./socket/chatServer");

const connectDB = require("./configs/database");
const router = require("./routers");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());

connectDB();

router(app);

const PORT = configuration().port;
const server = app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});

chatServer.listen(server);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
