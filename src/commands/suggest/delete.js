const suggestSchema = require("../../models/suggestions");
const Command = require("../../handlers/Command");

module.exports = class Delete extends Command {
    constructor(client) {
        super(client, {
            name: "delete",
            description: "Supprime une suggestion.",
            args: true,
            message: "Vous pouvez supprimer la suggestion d'une autre personne si vous en avez la permission, sinon vous ne pouvez que supprimer vos propres suggestions. Faites attention, ne confondez pas l'ID du message et l'ID de la suggestion !",
            usage: "{suggestionID}",
            perm: [],
            botPerm: [],
            aliases: [],
            category: "suggest",
            enabled: true
        })
    }
    async run(message, args, data) {

        const suggestionChannel = message.guild.channels.resolve(data.suggestions.channel);
        if (data.suggestions.channel === null || !suggestionChannel) 
            return message.channel.send(message.client.emotes.nope + " Aucun salon de suggestions valide trouvé !");
        
        const suggestionID = args[0];
        const find = await suggestSchema.findOne(
            {
                guildID: message.guild.id,
                suggestionID: suggestionID
            }
        );
        if (!find) return message.channel.send(message.client.emotes.nope + " Aucun ID de suggestions valide spécifié !");

        if (find.messAuthor !== message.author.id) {

            if (data.suggestions.role !== null) {

                const role = await message.guild.roles.fetch(data.suggestions.role);

                if (role && !message.member.permissions.has("MANAGE_GUILD")) {
                    
                    if (!message.member.roles.cache.has(role.id)) 
                        return message.channel.send(message.client.emotes.nope + ` Vous devez posséder le rôle ${role.name} ou la permission de gérer le serveur pour pouvoir exécuter cette commande.`);
               
                } else {

                    if (!message.member.permissions.has("MANAGE_GUILD")) 
                        return message.channel.send(message.client.emotes.nope + " Vous devez avoir la permission de gérer le serveur pour exécuter cette commande !")
                }
            } else {

                if (!message.member.permissions.has("MANAGE_GUILD")) 
                    return message.channel.send(message.client.emotes.nope + " Vous devez avoir la permission de gérer le serveur pour exécuter cette commande !")
            
            };

        };
    
        const reason = args.slice(1).join(" ") || "";
        if (reason.length && reason.length > 1024) 
            return message.channel.send(message.client.emotes.nope + " La raison ne doit pas dépasser les 1024 caractères !");

        let suggestion = await suggestionChannel.messages.fetch(find.messID).catch(() => {});

        if (!suggestion) 
            return message.channel.send(message.client.emotes.nope + " Le message de la suggestion n'a pas été trouvé :/");

        if (message.attachments.size > 0) 
            return message.channel.send(message.client.emotes.nope + " Les fichiers ne sont pas encore supportés !");

        const suggestionEmbed = suggestion.embeds[0];
        const newEmbed = {
            color: message.client.colors.discordColor,
            author: {
                name: suggestionEmbed.author.name,
                iconURL: suggestionEmbed.author.iconURL
            },
            fields: [
                {
                    name: "Suggestion supprimée",
                    value: reason.length ? reason : "\u200b"
                },
            ]
        }
     
        suggestion.edit(
            {
                embed: newEmbed
            }
        ).catch(() => {
            return message.channel.send(client.emotes.nope + " Je n'ai pas pu supprimer la suggestion...");
        });
        
        suggestion.reactions.removeAll().catch(() => {});

        await find.delete();
        message.channel.send(message.client.emotes.yup + " La suggestion a bien été supprimée.").then(msg => msg.delete({timeout: 5*1000}).catch(() => {}));
        message.delete(
            {
                timeout: 5*1000
            }
        ).catch(() => {});
    }
};