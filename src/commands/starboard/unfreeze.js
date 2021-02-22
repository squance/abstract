const starSchema = require("../../models/starboardMessages");
const Command = require("../../handlers/Command");

module.exports = class Unfreeze extends Command {
    constructor(client) {
        super(client, {
            name: "unfreeze",
            description: "Dégele un message du starboard.",
            args: true,
            message: null,
            usage: "{messageID}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-unfreeze"],
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
            if (!userMessage.freezed) {
                return message.channel.send(message.client.emotes.nope + " Les réactions de ce message ne sont pas gelées !");
            } else {
                await userMessage.updateOne(
                    {
                        freezed: false
                    }
                ).catch(error => {
                    return message.client.error(message, error);
                });
                return message.channel.send(message.client.emotes.yup + " Les réactions de ce message ne sont désormais plus gelées !")
            };
        } else if (botMessage) {
            if (!botMessage.freezed) {
                return message.channel.send(message.client.emotes.nope + " Les réactions de ce message ne sont pas gelées !");
            } else {
                await botMessage.updateOne(
                    {
                        freezed: false
                    }
                ).catch(error => {
                    return message.client.error(message, error);
                });
                return message.channel.send(message.client.emotes.yup + " Les réactions de ce message ne sont désormais plus gelées !")
            };
        } else {
            return message.channel.send(message.client.emotes.nope + " Veuillez préciser un identifiant de message valide !");
        };
    }
};