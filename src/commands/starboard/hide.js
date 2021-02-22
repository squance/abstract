const starSchema = require("../../models/starboardMessages");
const Command = require("../../handlers/Command");

module.exports = class Hide extends Command {
    constructor(client) {
        super(client, {
            name: "hide",
            description: "Cache un message du starboard.",
            args: true,
            message: "Un message caché n'est plus visible par personne.",
            usage: "{messageID}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-hide"],
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
    if (sbMessage.hidden) {
        return message.channel.send(client.emotes.nope + " Ce message est déjà caché.");
    } else {
        const starboard_channel = message.guild.channels.resolve(data.starboard.channel);

        if (!starboard_channel) 
            return message.channel.send(client.emotes.nope + " Aucun salon de starboard trouvé.");

        const star_message = await starboard_channel.messages.fetch(sbMessage.starboardID);

        if (!star_message) 
            return message.channel.send(client.emotes.nope + " Le message spécifié n'a pas été trouvé !");

        if (!star_message.embeds[0]) 
            return message.channel.send(client.emotes.nope + " Je n'ai pas pu modifier le message...");
        
        star_message.edit(star_message.content,
            {
                embed: {
                    color: message.client.colors.discordColor,
                    author: {
                        name: star_message.embeds[0].author.name,
                        iconURL: star_message.embeds[0].author.iconURL
                    },
                    footer: {
                        text: star_message.embeds[0].footer.text
                    },
                    description: "Message caché"
                }
            }
        ).catch(() => {
            return message.channel.send(message.client.emotes.nope + " Je n'ai pas pu modifier le message...");
        });
        await sbMessage.updateOne(
            {
                hidden: true
            }
        ).catch(error => {
            return message.client.error(message, error);
        });
        return message.channel.send(message.client.emotes.yup + " Ce message est désormais caché.");
    };
};