const { Schema, model } = require("mongoose");
const serverSchema = Schema(
    {
        guildID: String,
        prefix: String,
        premium: Boolean,
        blacklisted: Boolean,
        suggestions: {
            channel: String,
            role: String,
        },
        starboard: {
            active: Boolean,
            channel: String,
            selfstaring: Boolean,
            reactionNumber: Number,
            autoreact: Boolean,
            blacklistedChannels: Array,
        },
        infinity: {
            channel: String,
            lastNumber: Number,
            lastAuthorID: String
        }
    }
);
module.exports = model("serveurs", serverSchema);