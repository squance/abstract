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

    if (userData && userData.block) {
        return reaction.message.reactions.resolve("⭐").users
        .remove(user.id).catch(() => {})
    };


    const starboardChannel = reaction.message.guild.channels.resolve(serverData.starboard.channel);
    if (!starboardChannel) return;

    if (!serverData.starboard.selfstaring && user.id === reaction.message.author.id) {
        return reaction.users.remove(user.id).catch(() => {});
    };

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

        if (user_star_message.freezed) return reaction.message.reactions
        .resolve("⭐").users
        .remove(user.id).catch(() => {});

        if (user_star_message.reactUsers.includes(user.id)) return;

        const toEdit = await starboardChannel.messages
        .fetch(user_star_message.starboardID).catch(() => {});

        if (!toEdit) return user_star_message.delete();

        const count = user_star_message.count+1;
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
        array.push(user.id)
        await user_star_message.updateOne(
            {
                count: user_star_message.count+1,
                color: color,
                reactUsers: array,
                userMessageCount: user_star_message.userMessageCount+1
            }
        );

    } else if (bot_star_message && reaction.message.author.id === client.user.id) {

        if (!serverData.starboard.selfstaring && user.id === bot_star_message.messAuthor) {
            return reaction.users.remove(user.id).catch(() => {});
        };

        if (bot_star_message.freezed) return reaction.message.reactions
        .resolve("⭐").users
        .remove(user.id).catch(() => {});

        if (bot_star_message.reactUsers.includes(user.id)) return;

        const ogChannel = reaction.message.guild.channels
        .resolve(bot_star_message.channel);

        if (!ogChannel) {
            bot_star_message.delete().catch(e => client.error2(e));
            return reaction.message.delete().catch(() => {});
        };

        const ogMessage = await ogChannel.messages.fetch(bot_star_message.messID).catch(() => {});
        if (!ogMessage) return user_star_message.delete().catch(error => client.error2(error));

        const count = bot_star_message.count+1;
        
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
        }

        const array = bot_star_message.reactUsers
        array.push(user.id)
        await bot_star_message.updateOne(
            {
                count: bot_star_message.count+1,
                color: color,
                reactUsers: array,
                botMessageCount: bot_star_message.botMessageCount+1
            }
        );

    } else {

        if (reaction.count < serverData.starboard.reactionNumber) return;
        if (reaction.message.author.bot) return;
        const image = reaction.message.attachments.size > 0 
        ? reaction.message.attachments.first().url 
        : `${reaction.message.embeds.length 
            ? `${reaction.message.embeds[0].image 
                ? reaction.message.embeds[0].image.url 
                : reaction.message.embeds[0].thumbnail ? reaction.message.embeds[0].thumbnail.url : ""}` 
            : ""}`;

        const attachmentDescription = image ? `${image.length > 20 ? `[${image.substr(0, 20)}...](${image})` : image}` : ""
        const content =  (image ? client.emotes.file + " " : "") + (reaction.message.content ? 
            reaction.message.content.length > 1700 ? reaction.message.content.substr(0, 1700) + "..." : reaction.message.content
        : null);
        
        const color = verifEmoteAndColor(reaction.count)[1];
        const emoji = verifEmoteAndColor(reaction.count)[0];
        const embed = {
            color: color,
            author: {
                name: reaction.message.author.tag,
                iconURL: reaction.message.author.displayAvatarURL({dynamic: true})
            },
            description: content ? content : attachmentDescription,
            image: {
                url: image
            },
            footer: {
                text: "ID : " + reaction.message.id
            },
            fields: [
                {
                    name: "\u200b",
                    value: `**[Aller au message](${reaction.message.url})**`
                }
            ]
        };
      
        starboardChannel.send(`**${emoji} ${reaction.count}・**<#${reaction.message.channel.id}>`,
            {
                embed: embed
            }
        ).then(async(msg) => {
            if (serverData.starboard.autoreact) msg.react("⭐").catch(() => {});

            const array = [];
            reaction.users.cache.forEach(user => array.push(user.id));

            await new starSchema(
                {
                    guildID: reaction.message.guild.id,
                    messID: reaction.message.id,
                    messAuthor: reaction.message.author.id,
                    starboardID: msg.id,
                    tag: reaction.message.author.tag,
                    color: "faf09c",
                    channel: reaction.message.channel.id,
                    freezed: false,
                    content:content ? content : attachmentDescription,
                    field: `**[Aller au message](${reaction.message.url})**`,
                    attachments: image ? image : null,
                    hidden: false,
                    reactUsers: array,
                    botMessageCount: 0,
                    userMessageCount: reaction.count,
                    count: reaction.count
                }
            ).save().catch(error => client.error2(error));

        }).catch(() => {});


    };

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