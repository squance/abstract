const { Schema, model } = require("mongoose");
const suggestionSchema = Schema(
    {
        guildID: String,
        suggestionID: String,
        messID: String,
        messAuthor: String
    }
);
module.exports = model("suggestions", suggestionSchema);