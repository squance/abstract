const Command = require("../../handlers/Command");

module.exports = class Starboard extends Command {
    constructor(client) {
        super(client, {
            name: "starboard",
            description: "Active ou désactive le starboard.",
            args: true,
            message: null,
            usage: "{oui/non}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: [],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {

        switch (args[0]) {
            case "oui":
                if (data.starboard.active) {
                    message.channel.send(message.client.emotes.nope + " Le starboard est déjà activé.");
                } else if (data.starboard.channel === null) {
                    message.channel.send(message.client.emotes.nope + " Avant d'activer le starboard, veillez à avoir un salon de starboard.")
                } else {
                    await data.updateOne(
                        {
                            starboard: {
                                active: true,
                                channel:  data.starboard.channel,
                                selfstaring:  data.starboard.selfstaring,
                                reactionNumber:  data.starboard.reactionNumber,
                                autoreact:  data.starboard.autoreact,
                                blacklistedChannels:  data.starboard.blacklistedChannels,
                            }
                        }
                    );
                    return message.channel.send(message.client.emotes.yup + " Le starboard est désormais activé.");
                };
                break;
            case "non":
                if (!data.starboard.active) {
                    message.channel.send(message.client.emotes.nope + " Le starboard est déjà désactivé.");
                } else {
                    await data.updateOne(
                        {
                            starboard: {
                                active: false,
                                channel:  data.starboard.channel,
                                selfstaring:  data.starboard.selfstaring,
                                reactionNumber:  data.starboard.reactionNumber,
                                autoreact:  data.starboard.autoreact,
                                blacklistedChannels:  data.starboard.blacklistedChannels,
                            }
                        }
                    );
                    return message.channel.send(message.client.emotes.yup + " Le starboard est désormais désactivé.");
                };
                break;
            default:
                message.channel.send(message.client.emotes.nope + " Veillez à bien spécifier une réponse parmi les suivantes: \`oui\` ou \`non\`.")
                break;
        };
    }
};