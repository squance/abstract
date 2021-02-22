const starSchema = require("../../models/starboardMessages");
const Command = require("../../handlers/Command");

module.exports = class Freeze extends Command {
    constructor(client) {
        super(client, {
            name: "freeze",
            description: "Gele un message du starboard.",
            args: true,
            message: "Lorsque les réactions d'un message sont freeze, plus personne ne peut retirer ou ajouter une réaction au message.",
            usage: "{messageID}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-freeze"],
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

            if (userMessage.freezed) {
                return message.channel.send(message.client.emotes.nope + " Les réactions de ce message sont déjà gelées !");
            } else {
                await userMessage.updateOne(
                    {
                        freezed: true
                    }
                ).catch(error => {
                    return message.client.error(message, error);
                });
                return message.channel.send(message.client.emotes.yup + " Les réactions de ce message sont désormais gelées !")
            };

        } else if (botMessage) {

            if (botMessage.freezed) {
                return message.channel.send(message.client.emotes.nope + " Les réactions de ce message sont déjà gelées !");
            } else {
                await botMessage.updateOne(
                    {
                        freezed: true
                    }
                ).catch(error => {
                    return message.client.error(message, error);
                });
                return message.channel.send(message.client.emotes.yup + " Les réactions de ce message sont désormais gelées !")
            };

        } else {
            return message.channel.send(message.client.emotes.nope + " Veuillez préciser un identifiant de message valide !");
        };
    }
};