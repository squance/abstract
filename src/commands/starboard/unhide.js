const starSchema = require("../../models/starboardMessages");
const Command = require("../../handlers/Command");

module.exports = class Unhide extends Command {
    constructor(client) {
        super(client, {
            name: "unhide",
            description: "Fait réapparaître le message caché.",
            args: true,
            message: null,
            usage: "{messageID}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-unhide"],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {

        if (!data.starboard.active) 
            return message.channel.send(message.client.emotes.nope + " Le starboard n'est pas activé.");

        const messageID = args[0];
        const userMessage = await starSchema.findOne(
            {
                guildID: message.guild.id,
                messID: messageID
            }
        );

        const botMessage = await starSchema.findOne(
            {
                guildID: message.guild.id,
                starboardID: messageID
            }
        );

        if (userMessage) {
            await handleHide(userMessage, message.client, message, data);
        } else if (botMessage) {
            await handleHide(botMessage, message.client, message, data);
        } else {
            return message.channel.send(message.client.emotes.nope + " Veuillez préciser un identifiant de message valide.");
        };
    }
};

const handleHide = async (sbMessage, client, message, data) => {
    if (!sbMessage.hidden) {
        return message.channel.send(client.emotes.nope + " Ce message n'est pas caché.");
    } else {
        const starboard_channel = message.guild.channels.resolve(data.starboard.channel);

        if (!starboard_channel) return message.channel.send(client.emotes.nope + " Aucun salon de starboard trouvé.");

        const star_message = await starboard_channel.messages.fetch(sbMessage.starboardID);

        if (!star_message) return message.channel.send(client.emotes.nope + " Le message spécifié n'a pas été trouvé !");
        
        star_message.edit(star_message.content,
            {
                embed: {
                    color: sbMessage.color,
                    author: {
                        name: star_message.embeds[0].author.name,
                        iconURL: star_message.embeds[0].author.iconURL
                    },
                    image: {
                        url: sbMessage.attachments ? sbMessage.attachments : ""
                    },
                    fields: [
                        {
                            name: "\u200b",
                            value: sbMessage.field
                        }
                    ],
                    description: sbMessage.content,
                    footer: {
                        text: star_message.embeds[0].footer.text
                    },
                }
            }
        ).catch(() => {
            return message.channel.send(client.emotes.nope + " Je n'ai pas pu modifier le message...");
        });
        await sbMessage.updateOne(
            {
                hidden: false
            }
        ).catch(error => {
            return message.client.error(message, error);
        });
        return message.channel.send(client.emotes.yup + " Ce message n'est désormais plus caché.");
    };
};