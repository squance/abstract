const Command = require("../../handlers/Command");
module.exports = class Settings extends Command {
    constructor(client) {
        super(client, {
            name: "settings",
            description: "Affiche la configuration du bot.",
            args: false,
            message: null,
            usage: null,
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["config", "configuration"],
            category: "utile",
            enabled: true
        })
    }
    async run(message, args, data) {

        function link(msg) {
            return `[${msg}](${message.client.links.invite})`
        };

        //starboard
        let starboard;
        if (data.starboard.channel !== null) {
            starboard = message.guild.channels.resolve(data.starboard.channel);
            if (starboard) {
                starboard = `<#${starboard.id}>`;
            } else {
                starboard = `${message.client.emotes.channelNotFound} ${link("introuvable")}`;
            };
        } else {
            starboard = `${message.client.emotes.channelNotFound} ${link("aucun")}`;
        };

        //suggestions
        let suggest;
        if (data.suggestions.channel !== null) {
            suggest = message.guild.channels.resolve(data.suggestions.channel);
            if (suggest) {
                suggest = `<#${suggest.id}>`;
            } else {
                suggest = `${message.client.emotes.channelNotFound} ${link("introuvable")}`;
            };
        } else {
            suggest = `${message.client.emotes.channelNotFound} ${link("aucun")}`;
        };

        //rôle de suggestions
        let suggestRole;
        if (data.suggestions.role !== null) {
            suggestRole = message.guild.roles.resolve(data.suggestions.role);
            if (suggestRole) {
                suggestRole = `<@&${suggestRole.id}>`;
            } else {
                suggestRole = `${message.client.emotes.role} ${link("introuvable")}`;
            }
        } else {
            suggestRole = `${message.client.emotes.role} ${link("aucun")}`;
        };

        //counter
        let counterChannel;
        if (data.infinity.channel !== null) {
            counterChannel = message.guild.channels.resolve(data.infinity.channel);
            if (counterChannel) {
                counterChannel = `<#${counterChannel.id}>`;
            } else {
                counterChannel = `${message.client.emotes.channelNotFound} ${link("introuvable")}`;
            };
        } else {
            counterChannel = `${message.client.emotes.channelNotFound} ${link("aucun")}`
        };

        const prefix = this.findPrefix(data);

        message.channel.send(
            {
                embed: {
                    color: message.client.colors.burple,
                    title: "Configuration de " + message.client.user.username,
                    url: message.client.links.invite,
                    description: `> Préfixe: ${prefix}・Premium: ${link(data.premium === true ? "oui" : "non")}`,
                    fields: [
                        {
                            name: "Starboard",
                            value: `> Activé: ${link(data.starboard.active ? "oui" : "non")}
                            > Salon: ${starboard}
                            > Selfstaring: ${link(data.starboard.selfstaring ? "oui" : "non")}
                            > Autoréact: ${link(data.starboard.autoreact ? "oui" : "non")}
                            > Réactions: ${link(data.starboard.reactionNumber ? data.starboard.reactionNumber : "0")}`
                        },
                        {
                            name: "Suggestions",
                            value: `> Salon: ${suggest}
                            > Role: ${suggestRole}`
                        },
                        {
                            name: "Compteur",
                            value: `> Salon: ${counterChannel}`
                        }
                    ]
                }
            }
        ).then(msg => {
            message.client.deleteThis(message, msg);
        });
    }
};