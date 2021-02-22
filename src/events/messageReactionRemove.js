// HANDLER DU STARBOARD
const starSchema = require("../models/starboardMessages");
const userSchema = require("./../models/users");
const serverSchema = require("./../models/server");

module.exports = async(client, reaction, user) => {

    if (user.bot) return;
    if (reaction.message.channel.type === "dm") return;
    if (!reaction) return;
    if (reaction.partial) reaction = await reaction.fetch().catch(() => {});
    if (reaction.message.partial) await reaction.message.fetch().catch(() => {});
    if (verifyType(reaction.message)) return;
    if (reaction.emoji.name !== "⭐") return;

    const serverData = await serverSchema.findOne(
        {
            guildID: reaction.message.guild.id
        }
    );

    if (!serverData || !serverData.starboard.active 
                    || serverData.starboard.blacklistedChannels.includes(reaction.message.channel.id)) return;

    const userData = await userSchema.findOne(
        {
            guildID: reaction.message.guild.id,
            userID: user.id
        }
    );

    if (userData && userData.block) return;

    const starboardChannel = reaction.message.guild.channels.resolve(serverData.starboard.channel);
    if (!starboardChannel) return;

    const user_star_message = await starSchema.findOne(
        {
            guildID: reaction.message.guild.id,
            messID: reaction.message.id
        }
    );

    const bot_star_message = await starSchema.findOne(
        {
            guildID: reaction.message.guild.id,
            starboardID: reaction.message.id
        }
    );

    if (user_star_message) {

        if (!serverData.starboard.selfstaring && user.id === reaction.message.author.id) return;
        if (user_star_message.freezed) return;

        const toEdit = await starboardChannel.messages
        .fetch(user_star_message.starboardID).catch(() => {});

        if (!toEdit) return user_star_message.delete();

        const react = toEdit.reactions.resolve("⭐");
        if (react) {
            if (react.users.cache.has(user.id)) return;
        };

        const count = user_star_message.count-1;

        if (count < serverData.starboard.reactionNumber) {
            await user_star_message.delete().catch(error => client.error2(error));
            toEdit.delete().catch(() => {});
        } else {
            const color = verifEmoteAndColor(count)[1];
            const emoji = verifEmoteAndColor(count)[0];
            const embed = toEdit.embeds[0];
    
            if (!embed) return;
            embed.color = color;
            if (user_star_message.hidden) {
                toEdit.edit(`**${emoji} ${count}・**<#${reaction.message.channel.id}>`).catch(() => {});
            } else {
                toEdit.edit(`**${emoji} ${count}・**<#${reaction.message.channel.id}>`,
                    {
                        embed: embed
                    }
                ).catch(() => {});
            }
    
            const array = user_star_message.reactUsers
            const index = array.indexOf(user.id);
            if (index > -1) {
                array.splice(index, 1);
            };
            await user_star_message.updateOne(
                {
                    count: user_star_message.count-1,
                    color: color,
                    reactUsers: array,
                    userMessageCount: user_star_message.userMessageCount-1
                }
            );
        }

    } else if (bot_star_message && reaction.message.author.id === client.user.id) {
        if (!serverData.starboard.selfstaring && user.id === bot_star_message.messAuthor) return;
        if (bot_star_message.freezed) return;

        const ogChannel = reaction.message.guild.channels
        .resolve(bot_star_message.channel);

        if (!ogChannel) {
            bot_star_message.delete().catch(e => client.error2(e));
            return reaction.message.delete().catch(() => {});
        };

        const ogMessage = await ogChannel.messages.fetch(bot_star_message.messID).catch(() => {});
        if (!ogMessage) return user_star_message.delete().catch(error => client.error2(error));

        const react = ogMessage.reactions.resolve("⭐");
        if (react) {
            if (react.users.cache.has(user.id)) return;
        };

        const count = bot_star_message.count-1;

        if (count < serverData.starboard.reactionNumber) {

            reaction.message.delete().catch(() => {});
            await bot_star_message.delete().catch(error => client.error2(error));

        } else {
            const color = verifEmoteAndColor(count)[1];
            const emoji = verifEmoteAndColor(count)[0];
            const embed = reaction.message.embeds[0];
    
            embed.color = color
            if (bot_star_message.hidden) {
                reaction.message.edit(`**${emoji} ${count}・**<#${bot_star_message.channel}>`).catch(() => {});
            } else {
                reaction.message.edit(`**${emoji} ${count}・**<#${bot_star_message.channel}>`,
                    {
                        embed: embed
                    }
                ).catch(() => {});
            };
    
            const array = bot_star_message.reactUsers
            const index = array.indexOf(user.id);
            if (index > -1) {
                array.splice(index, 1);
            };
            await bot_star_message.updateOne(
                {
                    count: bot_star_message.count-1,
                    color: color,
                    reactUsers: array,
                    botMessageCount: bot_star_message.botMessageCount-1
                }
            );
        };

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