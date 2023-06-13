const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose.connection;

// MONGOOSE DB
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@autoforwardbot.g1i40fv.mongodb.net/?retryWrites=true&w=majority
`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
);

db.on("connected", () => {
    console.log("DB connected");
});

db.on("error", console.error.bind(console, "connection error:"));
