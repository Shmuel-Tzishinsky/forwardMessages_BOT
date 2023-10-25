const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose.connection;

// MONGOOSE DB
mongoose.connect(
  `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.g63hosm.mongodb.net/`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

db.on("connected", () => {
  console.log("DB connected");
});

db.on("error", console.error.bind(console, "connection error:"));
