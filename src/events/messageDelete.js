const snipeSchema = require("./../models/snipe");
const starSchema = require("./../models/starboardMessages");
const serverSchema = require("./../models/server");

module.exports = async(client, message) => {

    try {
        if (!message.guild || !message) return;
    
        const data = await serverSchema.findOne(
            {
                guildID: message.guild.id
            }
        );

        if (data) {
            const starboardChannel = message.guild.channels.resolve(data.starboard.channel);
            if (starboardChannel) {
                
                // star = user starboard message
                const star = await starSchema.findOne(
                    {
                        guildID: message.guild.id,
                        messID: message.id
                    }
                );

                if (star) {

                    // si les données de starboard du message sont trouvées, alors il fetch le message du starboard du bot et le supprime
                    const toDelete = await starboardChannel.messages.fetch(star.starboardID);
                    if (toDelete) {
                        toDelete.delete().catch(() => {});
                        star.delete();
                    };
            
                } else {

                    // star2 = client starboard message
                    const star2 = await starSchema.findOne(
                        {
                            guildID: message.guild.id,
                            starboardID: message.id
                        }
                    );
                    // si y'a des données, ça les supprime parce qu'il faut ménager la db x')
                    if (star2) {
                        star2.delete().catch(() => {});
                    };
                };

            }
        };

        if (verifyType(message)) return;
        const snipe = await snipeSchema.findOne(
            {
                guildID: message.guild.id,
                channelID: message.channel.id,
            }
        );

        let attachmentsArray = [];
        if (message.attachments) {

            message.attachments.forEach(attachment => {
                attachmentsArray.push(
                    {
                        name: attachment.name,
                        url: attachment.url
                    }
                );
            });
            
        };
        const deleteSnipeAfterX = 60*1000 // 60 secondes
        if (!snipe) {
            new snipeSchema(
                {
                    guildID: message.guild.id,
                    channel: message.channel.name,  // channel NAME
                    id: message.id,
                    channelID: message.channel.id, // channel ID
                    content: message.content ? message.content : null,
                    author: {
                        tag: message.author.tag,
                        avatar: message.author.displayAvatarURL(
                            {
                                dynamic: true
                            }
                        ),
                    },
                    embeds: message.embeds.length ? message.embeds : [],
                    attachments: attachmentsArray,
                    createdTimestamp: message.createdTimestamp
                }
            ).save().then(function(snipe) {

                setTimeout(function() {

                    snipe.delete().catch(function(error) {

                        client.error2(error);

                    });

                }, deleteSnipeAfterX);

            });

        } else {
            await snipe.updateOne(
                {
                    guildID: message.guild.id,
                    channel: message.channel.name,  // channel NAME
                    id: message.id,
                    channelID: message.channel.id, // channel ID
                    content: message.content ? message.content : null,
                    author: {
                        tag: message.author.tag,
                        avatar: message.author.displayAvatarURL({dynamic: true}),
                    },
                    embeds: message.embeds.length ? message.embeds : [],
                    attachments: attachmentsArray,
                    createdTimestamp: message.createdTimestamp
                }
            );
            setTimeout(function() {

                snipe.delete().catch(function(error) {

                    client.error2(error);

                })

            }, deleteSnipeAfterX);
        };

    } catch (error) {
        return;
    }
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