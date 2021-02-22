const { Schema, model } = require("mongoose");
const userSchema = Schema(
    {
        guildID: String,
        userID: String,
        block: Boolean
    }
);
module.exports = model("utilisateurs", userSchema);