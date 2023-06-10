const { Schema, model } = require("mongoose");

const ForwardSchema = new Schema({
    from: [],
    to: [],
    id: Number,
    name: String,
    worker: String,
});

module.exports = model("Forward", ForwardSchema);
