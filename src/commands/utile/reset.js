const Command = require("../../handlers/Command");
const counterSchema = require("../../models/counter");

module.exports = class Reset extends Command {
    constructor(client) {
        super(client, {
            name: "reset",
            description: "Réinitialise un paramètre.",
            args: true,
            message: "Voici les différents paramètres que vous pouvez réinitialiser:\n\`\`\`suggest-channel, suggest-role, suggestions (qui réinitialisera à la fois le rôle et le salon), sb-channel, sb-config, counter, prefix\`\`\`",
            usage: "{paramètre}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: [],
            category: "utile",
            enabled: true
        })
    }
    async run(message, args, data) {

        // BRUH

        const param = args.join(" ");
        switch (param) {
            case "suggest-channel":
                if (data.suggestions.channel !== null) {
                    await data.updateOne(
                        {
                            suggestions: {
                                channel: null,
                                role: data.suggestions.role,
                            },
                        }
                    ).catch(error => {
                        return message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le salon de suggestions n'a pas été configuré.");
                };
                break;
            case "suggest-role":
                if (data.suggestions.role !== null) {
                    await data.updateOne(
                        {
                            suggestions: {
                                channel: data.suggestions.channel,
                                role: null,
                            },
                        }
                    ).catch(error => {
                        return message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le rôle de suggestions n'a pas été configuré.");
                };
                break;
            case "suggestions":
                if (data.suggestions.role !== null) {
                    await data.updateOne(
                        {
                            suggestions: {
                                channel: data.suggestions.channel,
                                role: null,
                            },
                        }
                    ).catch(error => {
                        message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le rôle de suggestions n'a pas été configuré.");
                };
                if (data.suggestions.channel !== null) {
                    await data.updateOne(
                        {
                            suggestions: {
                                channel: data.suggestions.channel,
                                role: null,
                            },
                        }
                    ).catch(error => {
                        message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le salon de suggestions n'a pas été configuré.");
                };
                break;
            case "sb-channel":
                if (data.starboard.channel !== null) {
                    await data.updateOne(
                        {
                            starboard: {
                                active: data.starboard.active,
                                channel: null,
                                selfstaring: data.starboard.selfstaring,
                                reactionNumber: data.starboard.reactionNumber,
                                autoreact: data.starboard.autoreact,
                                blacklistedChannels: data.starboard.blacklistedChannels,
                            },
                        }
                    ).catch(error => {
                        message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le salon de starboard n'a pas été configuré.");
                };
                break;
            case "sb-config":
                if (data.starboard.channel !== null) {
                    await data.updateOne(
                        {
                            starboard: {
                                active: false,
                                channel: null,
                                selfstaring: true,
                                reactionNumber: 1,
                                autoreact: true,
                                blacklistedChannels: [],
                            },
                        }
                    ).catch(error => {
                        message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le starboard n'a pas été configuré.");
                };
                break;
            case "counter":
                if (data.infinity.channel !== null) {
                    await data.updateOne(
                        {
                            infinity: {
                                channel: null,
                                lastNumber: 0,
                                lastAuthorID: null
                            }
                        }
                    ).catch(error => {
                        message.client.error(message, error);
                    });
                    const counter_datas = await counterSchema.find(
                        {
                            guildID: message.guild.id
                        }
                    );
                    if (counter_datas) {
                        counter_datas.forEach(c => {
                            c.delete();
                        });
                    };
                } else {
                    message.channel.send(message.client.emotes.nope + " Le compteur n'a pas été configuré.");
                };
                break;
            case "prefix":
                if (data.prefix !== null) {
                    await data.updateOne(
                        {
                            prefix: null
                        }
                    ).catch(error => {
                        message.client.error(message, error);
                    });
                } else {
                    message.channel.send(message.client.emotes.nope + " Le préfixe n'a pas été changé.");
                };
                break;
            default:
                message.channel.send(message.client.emotes.nope + " Spécifiez un paramètre valide parmi la liste suivante :```suggest-channel, suggest-role, suggestions (qui réinitialisera à la fois le rôle et le salon), sb-channel, sb-config, counter, prefix```");
                break;
        };

        this.send(message, param + " a bien été réinitialisé.");

    }
};