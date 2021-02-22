const Command = require("../../handlers/Command");

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Affiche la page d'aide du bot.",
            args: false,
            message: "Tapez help <commande> pour avoir plus d'informations sur une commande particulière.",
            usage: "(commande)",
            perm: [],
            botPerm: [],
            aliases: [],
            category: "utile",
            enabled: true
        })
    }
    async run(message, args, data) {

        const prefix = this.findPrefix(data);
        let command;
        if (args[0]) {
            command = message.client.commands.get(args[0]) || message.client.commands.find(cmd => cmd.help.aliases.includes(args[0]));
        } else {
            command = null;
        };

        if (command && command.category !== "owner") {
            return message.channel.send({

                embed: {
                    color: message.client.colors.burple,
                    thumbnail: {
                        url: message.client.user.displayAvatarURL({size: 1024, format: "png"})
                    },
                    title: `Commande: ${command.help.name}`,
                    url: message.client.links.invite,
                    description: `Activée: ${command.help.enabled ? message.client.emotes.greenSmallSquare : message.client.config.redSmallSquare}
                    Description: [${command.help.description}](${message.client.links.invite})
                    Message: [${command.help.message ? command.help.message : `aucun`}](${message.client.links.invite})
                    Aliases: [${command.help.aliases.length > 0 ? command.help.aliases.map(v => v).join(", ") : "aucun"}](${message.client.links.invite})
                    Catégorie: [${command.help.category}](${message.client.links.invite})
                    Utilisation: [${command.help.usage ? `${prefix}${command.help.name} ${command.help.usage}` : "aucune"}](${message.client.links.invite})
                    Permissions: [${command.help.perm.length > 0 ? command.help.perm.map(v => v.toLowerCase()).join(", ") : "aucune"}](${message.client.links.invite})
                    Permissions du bot: [${command.help.botPerm.length > 0 ? command.help.botPerm.map(v => v.toLowerCase()).join(", ") : "aucune"}](${message.client.links.invite})` //ok
                }

            });
        } else {
            const arrayOfCommands = [];
            message.client.categories.forEach(category => {
                arrayOfCommands.push(
                    {
                        name: category,
                        commands: message.client.commands.filter(cmd => cmd.help.category === category).map(cmd => `\`${cmd.help.name}\``).join("・")
                    }
                );
            });
            const helpEmbed = {
                color: message.client.colors.burple,
                author: {
                    name: "Commandes d' " + message.client.user.username,
                    url: message.client.links.invite
                },
                thumbnail: {
                    url: message.client.user.displayAvatarURL({size: 1024})
                },
                description: `[Invitation](${message.client.links.invite})・[Support](${message.client.links.support})・[Github](${message.client.links.github})・[Doc](${message.client.links.documentation})
                Tips: \`${prefix}help <commande>\`

                **Configuration**
                ${arrayOfCommands.filter(c => c.name === "utile")[0].commands}

                **Compteur**
                ${arrayOfCommands.filter(c => c.name === "counter")[0].commands}

                **Suggestions**
                ${arrayOfCommands.filter(c => c.name === "suggest")[0].commands}

                **Starboard**
                ${arrayOfCommands.filter(c => c.name === "starboard")[0].commands}` // les embeds sont cassés sur téléphone

            }
            message.channel.send(
                {
                    embed: helpEmbed
                }
            ).then(msg => {
                message.client.deleteThis(message, msg);
            });
        };
    }
};
