// HANDLER DU STARBOARD
const starSchema = require("../models/starboardMessages");
const serverSchema = require("./../models/server");

module.exports = async(client, message) => {

    if (verifyType(message)) return;

    const serverData = await serverSchema.findOne(
        {
            guildID: message.guild.id
        }
    );

    if (!serverData || !serverData.starboard.active 
                    || serverData.starboard.blacklistedChannels.includes(message.channel.id)) return;


    const starboardChannel = message.guild.channels.resolve(serverData.starboard.channel);
    if (!starboardChannel) return;

    const user_star_message = await starSchema.findOne(
        {
            guildID: message.guild.id,
            messID: message.id
        }
    );

    const bot_star_message = await starSchema.findOne(
        {
            guildID: message.guild.id,
            starboardID: message.id
        }
    );

    if (user_star_message) {

        if (user_star_message.freezed) return;
        const toEdit = await starboardChannel.messages
        .fetch(user_star_message.starboardID).catch(() => {});
        if (!toEdit) return user_star_message.delete();
        const react = toEdit.reactions.resolve("⭐");
        if (!react) {
            return delete_this_data(user_star_message, toEdit);
        };

        const count = user_star_message.botMessageCount;

        if (count < serverData.starboard.reactionNumber) {

            return delete_this_data(user_star_message, toEdit);

        } else {

            const color = verifEmoteAndColor(count)[1];
            const emoji = verifEmoteAndColor(count)[0];
            const embed = toEdit.embeds[0];
    
            if (!embed) return;
            embed.color = color;
            if (user_star_message.hidden) {
                toEdit.edit(`**${emoji} ${count}・**<#${message.channel.id}>`).catch(() => {});
            } else {
                toEdit.edit(`**${emoji} ${count}・**<#${message.channel.id}>`,
                    {
                        embed: embed
                    }
                ).catch(() => {});
            };
    
            const array = [];
            react.users.cache.forEach(m => array.push(m.id));

            await user_star_message.updateOne(
                {
                    count: count,
                    color: color,
                    botMessageCount: 0,
                    reactUsers: array
                }
            );

        };

    } else if (bot_star_message && message.author.id === client.user.id) {
       
        if (bot_star_message.freezed) return;

        const ogChannel = message.guild.channels.resolve(bot_star_message.channel);
        if (!ogChannel) {
            return delete_this_data(bot_star_message, message);
        };

        const ogMessage = await ogChannel.messages
        .fetch(bot_star_message.messID).catch(() => {});

        if (!ogMessage) {
            return delete_this_data(bot_star_message, message);
        };

        const react = ogMessage.reactions.resolve("⭐");
        if (!react) {
            return delete_this_data(bot_star_message, message);
        };

        const count = bot_star_message.botMessageCount;

        if (count < serverData.starboard.reactionNumber) {
            return delete_this_data(bot_star_message, message);
        } else {

            const color = verifEmoteAndColor(count)[1];
            const emoji = verifEmoteAndColor(count)[0];
            const embed = message.embeds[0];
    
            if (!embed) return;
            embed.color = color;
            if (bot_star_message.hidden) {
                message.edit(`**${emoji} ${count}・**<#${bot_star_message.channel}>`).catch(() => {});
            } else {
                message.edit(`**${emoji} ${count}・**<#${bot_star_message.channel}>`,
                    {
                        embed: embed
                    }
                ).catch(() => {});
            };
    
            const array = [];
            react.users.cache.forEach(m => array.push(m.id));

            await bot_star_message.updateOne(
                {
                    count: count,
                    userMessageCount: 0,
                    color: color,
                    reactUsers: array
                }
            );

        }

    } else return; // else return, lol

};

function verifyType(message) {
    let MessageTypes=  [
        'RECIPIENT_ADD',
        'RECIPIENT_REMOVE',
        'CALL',
        'CHANNEL_NAME_CHANGE',
        'CHANNEL_ICON_CHANGE',
        'PINS_ADD',
        'GUILD_MEMBER_JOIN',
        'USER_PREMIUM_GUILD_SUBSCRIPTION',
        'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
        'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
        'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3',
        'CHANNEL_FOLLOW_ADD',
        null,
        'GUILD_DISCOVERY_DISQUALIFIED',
        'GUILD_DISCOVERY_REQUALIFIED'
    ]
    if(MessageTypes.includes(message.type)) return true
    else return false;
};

function verifEmoteAndColor(count) {
    if (count >= 1 && count < 4) {
        return ["⭐", "faf09c"];
    } else if (count >= 4 && count < 7) {
        return ["🌟", "faea64"];
    } else if (count >= 7 && count < 10) {
        return ["✨", "ebd500"];
    } else if (count >= 10) {
        return ["💫", "ffdf00"];
    };
};

async function delete_this_data(bot_star_message, message) {
    await bot_star_message.delete().catch(error => client.error2(error));
    message.delete().catch(() => {});
};