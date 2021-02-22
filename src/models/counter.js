const { Schema, model } = require("mongoose");
const counterSchema = Schema(
    {
        guildID: String,
        userID: String,
        totalMilliers: Number,
        totalCentaines: Number,
        totalNombres: Number,
        userTag: String
    }
);
module.exports = model("stats-compteur", counterSchema);