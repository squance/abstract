const suggestSchema = require("../../models/suggestions");
const Command = require("../../handlers/Command");

module.exports = class Suggest extends Command {
    constructor(client) {
        super(client, {
            name: "suggest",
            description: "Envoie une suggestion.",
            args: true,
            message: null,
            usage: "{suggestion}",
            perm: [],
            botPerm: [],
            aliases: ["idea"],
            category: "suggest",
            enabled: true
        })
    }
    async run(message, args, data) {

        const suggestionChannel = message.guild.channels.resolve(data.suggestions.channel);

        if (!suggestionChannel) return message.channel.send(message.client.emotes.nope + " Aucun salon de suggestions n'a été trouvé.");

        const suggestion = args.join(" ");
        if (suggestion.length < 5 || suggestion.length > 1024) 
            return message.channel.send(message.client.emotes.nope + " Votre suggestion doit être comprise entre 5 et 1024 caractères.");

        const suggestionID = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 7).toUpperCase();

        // plus tard, il y aura un code qui empêchera d'avoir deux ID pareils.

        const suggestionEmbed = {
            color: message.client.colors.burple,
            author: {
                name: message.author.tag + "・" + message.author.id,
                iconURL: message.author.displayAvatarURL({dynamic: true})
            },
            fields: [
                {
                    name: "Nouvelle suggestion",
                    value: suggestion
                }
            ],
            image: {},
            footer: {
                text: "ID de la suggestion: " + suggestionID
            }
        };

        if (message.attachments.size > 0) {

            suggestionEmbed.image.url = message.attachments.first().url;
            const description = [];
            message.attachments.forEach(file => {
                description.push(`${message.client.emotes.file}[${file.name.length > 10 ? file.name.substr(0, 8) + "..." : file.name}](${file.url})`)
            })
            suggestionEmbed.description = description.join(", ");

        };

        suggestionChannel.send(
            {
                embed: suggestionEmbed
            }
        ).then(async(msg) => {
            await new suggestSchema(
                {
                    guildID: message.guild.id,
                    suggestionID: suggestionID,
                    messID: msg.id,
                    messAuthor: message.author.id
                }
            ).save().catch(error => {
                return message.client.error(message, error);
            });

            for (const emoji of [message.client.emotes.yup, message.client.emotes.nope]) {
                msg.react(emoji).catch(() => {});
            };

            message.channel.send(message.client.emotes.yup + " Suggestion parfaitement envoyée !").then(m => m.delete({timeout:5000}).catch(() => {}));

            message.delete(
                {
                    timeout: 10*1000 // 10 secondes
                }
            ).catch(() => {});

        }).catch(() => {
            return message.channel.send(message.client.emotes.nope + " Je n'ai pas pu envoyer ta suggestion...");
        });
    }
};