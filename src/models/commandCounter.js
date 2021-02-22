const { Schema, model } = require("mongoose");
const commandCounter = Schema(
    {
        AbstractID: String,
        nombre: Number
    }
);
module.exports = model("commandes", commandCounter);