require("dotenv").config();

module.exports = () => ({
  port: process.env.PORT || 3000,
  database: {
    MONGO_URI:
      process.env.MONGO_URI || "mongodb://localhost:27017/realtime-chat",
  },
  JWT_SECRET: process.env.JWT_SECRET || "abcxyz",
  NODE_ENV: process.env.NODE_ENV || "development",
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin",
});
