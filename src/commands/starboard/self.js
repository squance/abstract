const Command = require("../../handlers/Command");

module.exports = class Self extends Command {
    constructor(client) {
        super(client, {
            name: "self",
            description: "Active ou désactive le selfstaring.",
            args: true,
            message: "Lorsque cette option est activée, l'auteur du message ne pourra pas réagir à son propre message, sauf si le bot ne possède pas la permission de l'en empêcher.",
            usage: "{oui/non}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-self"],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {
     
        switch (args[0]) {
            case "oui":
                if (data.starboard.selfstaring) {
                    message.channel.send(message.client.emotes.nope + " Le selfstaring est déjà activé.");
                } else {
                    await data.updateOne(
                        {
                            starboard: {
                                active: data.starboard.active,
                                channel:  data.starboard.channel,
                                selfstaring:  true,
                                reactionNumber:  data.starboard.reactionNumber,
                                autoreact:  data.starboard.autoreact,
                                blacklistedChannels:  data.starboard.blacklistedChannels,
                            }
                        }
                    );
                    return message.channel.send(message.client.emotes.yup + " Le selfstaring est désormais activé.");
                };
                break;
            case "non":
                if (!data.starboard.active) {
                    message.channel.send(message.client.emotes.nope + " Le selfstaring est déjà désactivé.");
                } else {
                    await data.updateOne(
                        {
                            starboard: {
                                active: data.starboard.active,
                                channel:  data.starboard.channel,
                                selfstaring:  false,
                                reactionNumber:  data.starboard.reactionNumber,
                                autoreact:  data.starboard.autoreact,
                                blacklistedChannels:  data.starboard.blacklistedChannels,
                            }
                        }
                    );
                    return message.channel.send(message.client.emotes.yup + " Le selfstaring est désormais désactivé.");
                };
                break;
            default:
                message.channel.send(message.client.emotes.nope + " Veillez à bien spécifier une réponse parmi les suivantes: \`oui\` ou \`non\`.")
                break;
        };
    }
};