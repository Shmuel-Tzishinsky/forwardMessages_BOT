const { Schema, model } = require("mongoose");

const sessionSchema = new Schema({
    id: Number,
    name: String,
    session: String,
    dialogs: [],
    isBot: Boolean,
});

module.exports = model("Session", sessionSchema);
