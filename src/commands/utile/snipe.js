const snipeSchema = require("../../models/snipe");
const Command = require("../../handlers/Command");

module.exports = class Snipe extends Command {
    constructor(client) {
        super(client, {
            name: "snipe",
            description: "Affiche le dernier message supprimé du salon.",
            args: false,
            message: "Le snipe n'affiche que le dernier message du salon supprimé il y a moins d'une minute. Attention, tous les messages n'apparaissent pas dans le snipe ;)",
            usage: null,
            perm: [],
            botPerm: [],
            aliases: [],
            category: "utile",
            enabled: true
        })
    }
    async run(message) {
 
        const snipe = await snipeSchema.findOne(
            {
                guildID: message.guild.id,
                channelID: message.channel.id
            }
        );
        if (!snipe) {
            message.channel.send(
                {
                    embed: {
                        color: message.client.colors.rouge,
                        description: message.client.emotes.redSmallSquare + " Aucun message supprimé dans ce salon."
                    }
                }
            );
        } else {
            const embed = {
                footer: {
                    text: "ID: " + snipe.id + " • " + "salon: #" + snipe.channel
                },
                color: message.client.colors.burple,
                description: snipe.content ? snipe.content : "aucun contenu de message basique",
                author: {
                    name: "Message de " + snipe.author.tag,
                    iconURL: snipe.author.avatar
                },
                timestamp: snipe.createdTimestamp,
                fields: []
            }
          
            if (snipe.attachments.length) {
                let arrayOfAttachments = snipe.attachments.map(file => `Name: [${file.name}](${file.url})`).join("\n");
                if (arrayOfAttachments.length > 900) attachments = attachments.substr(0, 897)+"...";
                embed.fields.push(
                    {
                        name: "Fichiers",
                        value: arrayOfAttachments
                    }
                );
            };
            
            message.channel.send(
                {
                    embed: embed
                }
            );

            if (snipe.embeds.length) {
                snipe.embeds.forEach(embed => {
                    embed.footer = {};
                    embed.footer.text = "ID: " + snipe.id + " • " + "salon: #" + snipe.channel;
                    embed.timestamp = snipe.createdTimestamp;
                    embed.author = {};
                    embed.author.name = "Message de " + snipe.author.tag;
                    embed.author.iconURL = snipe.author.avatar;
                    embed.color = message.client.colors.burple;
                    message.channel.send(
                        {
                            embed: embed
                        }
                    );
                });
            };

        };
    }
};