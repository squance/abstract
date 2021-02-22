const Command = require("../../handlers/Command");

module.exports = class Auto extends Command {
    constructor(client) {
        super(client, {
            name: "auto",
            description: "Active ou désactive l'auto-réaction.",
            args: true,
            message: "Lorsque cette option est activée, tous les messages qui apparaitront dans le starboard recevront automatiquement une réaction :star: pour que les membres puissent réagir depuis le message du bot.",
            usage: "{oui/non}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["autoreact", "auto-react", "sb-auto"],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {
   
        switch (args[0]) {
            case "oui":
                if (data.starboard.autoreact) {
                    message.channel.send(message.client.emotes.nope + " L'auto-réaction est déjà activée.");
                } else {
                    await data.updateOne(
                        {
                            starboard: {
                                active: data.starboard.active,                          // FRANCHEMENT, si vous me donnez une autre façon d'update les données
                                channel:  data.starboard.channel,                      // alors vous êtes gentils <3
                                selfstaring:  data.starboard.selfstaring,
                                reactionNumber:  data.starboard.reactionNumber,
                                autoreact:  true,
                                blacklistedChannels:  data.starboard.blacklistedChannels,
                            }
                        }
                    );
                    return message.channel.send(message.client.emotes.yup + " L'auto-réaction est désormais activée.");
                };
                break;
            case "non":
                if (!data.starboard.active) {
                    message.channel.send(message.client.emotes.nope + " L'auto-réaction est déjà désactivée.");
                } else {
                    await data.updateOne(
                        {
                            starboard: {
                                active: data.starboard.active,
                                channel:  data.starboard.channel,
                                selfstaring:  data.starboard.selfstaring,
                                reactionNumber:  data.starboard.reactionNumber,
                                autoreact:  false,
                                blacklistedChannels:  data.starboard.blacklistedChannels,
                            }
                        }
                    );
                    return message.channel.send(message.client.emotes.yup + " L'auto-réaction est désormais désactivée.");
                };
                break;
            default:
                message.channel.send(message.client.emotes.nope + " Veillez à bien spécifier une réponse parmi les suivantes: \`oui\` ou \`non\`.")
                break;
        }
    }
};