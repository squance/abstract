const suggestSchema = require("../../models/suggestions");
const Command = require("../../handlers/Command");

module.exports = class Deny extends Command {
    constructor(client) {
        super(client, {
            name: "deny",
            description: "Refuse une suggestion",
            args: true,
            message: "Faites attention, ne confondez pas l'ID du message et l'ID de la suggestion !",
            usage: "{suggestionID}",
            perm: [],
            botPerm: [],
            aliases: ["refuse"],
            category: "suggest",
            enabled: true
        })
    }
    async run(message, args, data) {

        const suggestionChannel = message.guild.channels.resolve(data.suggestions.channel);
        if (data.suggestions.channel === null || !suggestionChannel) 
            return message.channel.send(message.client.emotes.nope + " Aucun salon de suggestions valide trouvé !");
        
        if (data.suggestions.role !== null) {

            const role = await message.guild.roles.fetch(data.suggestions.role);
            if (role && !message.member.permissions.has("MANAGE_GUILD")) {
                if (!message.member.roles.cache.has(role.id)) 
                    return message.channel.send(message.client.emotes.nope + ` Vous devez posséder le rôle ${role.name} ou la permission de gérer le serveur pour pouvoir exécuter cette commande.`);
            } else {
                if (!message.member.permissions.has("MANAGE_GUILD")) 
                    return message.channel.send(message.client.emotes.nope + " Vous devez avoir la permission de gérer le serveur pour exécuter cette commande !");
            }
        } else {
            if (!message.member.permissions.has("MANAGE_GUILD")) 
                return message.channel.send(message.client.emotes.nope + " Vous devez avoir la permission de gérer le serveur pour exécuter cette commande !");
        };

        const suggestionID = args[0];
        const find = await suggestSchema.findOne(
            {
                guildID: message.guild.id,
                suggestionID: suggestionID
            }
        );
        if (!find) return message.channel.send(message.client.emotes.nope + " Aucun ID de suggestions valide spécifié !");

        const reason = args.slice(1).join(" ") || "";
        if (reason.length && reason.length > 1024) 
            return message.channel.send(message.client.emotes.nope + " La raison ne doit pas dépasser les 1024 caractères !");

        let suggestion = await suggestionChannel.messages.fetch(find.messID).catch(() => {});
        if (!suggestion) return message.channel.send(message.client.emotes.nope + " Le message de la suggestion n'a pas été trouvé :/");
        if (message.attachments.size > 0) return message.channel.send(message.client.emotes.nope + " Les fichiers ne sont pas encore supportés !");

        const suggestionEmbed = suggestion.embeds[0];
        const newEmbed = {
            color: message.client.colors.rouge,
            author: {
                name: suggestionEmbed.author.name,
                iconURL: suggestionEmbed.author.iconURL
            },
            description: suggestionEmbed.description ? suggestionEmbed.description : "",
            footer: {
                text: suggestionEmbed.footer.text
            },
            image: {
                url: suggestionEmbed.image ? suggestionEmbed.image.url : ""
            },
            fields: [
                {
                    name: "Suggestion refusée",
                    value: suggestionEmbed.fields[0].value
                },
            ]
        }
        if (reason.length) {
            newEmbed.fields.push({
                name: "Commentaire de " + message.author.username,
                value: reason
            });
        };
        suggestion.edit(
            {
                embed: newEmbed
            }
        ).catch(() => {
            return message.channel.send(client.emotes.nope + " Je n'ai pas pu modifier le message...");
        });
        const member = message.guild.members.resolve(find.messAuthor);
        if (member) {
            member.send(
                {
                    embed: {
                        color: message.client.colors.rouge,
                        description: `Votre [suggestion](${suggestion.url}) a été refusée.`
                    }
                }
            ).catch(() => {});
        };
        await find.delete();
        message.channel.send(message.client.emotes.yup + " La suggestion a bien été refusée.").then(msg => msg.delete({timeout: 5*1000}).catch(() => {}));
        message.delete(
            {
                timeout: 5*1000
            }
        ).catch(() => {});
    }
};