const { Schema, model } = require("mongoose");
const starSchema = Schema(
    {
        guildID: String,
        messID: String,
        messAuthor: String,
        starboardID: String,
        tag: String,
        color: String,
        channel: String,
        freezed: Boolean,
        content: String,
        field: String,
        attachments: String,
        hidden: Boolean,
        reactUsers: Array,
        botMessageCount: Number,
        userMessageCount: Number,
        count: Number
    }
);
module.exports = model("starboard", starSchema);