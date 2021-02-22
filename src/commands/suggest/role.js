const Command = require("../../handlers/Command");

module.exports = class Role extends Command {
    constructor(client) {
        super(client, {
            name: "role",
            description: "Configure le rôle pouvant interagir avec les suggestions.",
            args: true,
            message: "Cette commande permet de définir un rôle qui peut interagir avec les suggestions. Une fois attribué, seules les personnes possédant la permission de gérer le serveur ou possédant ce rôle pourrant interagir avec les suggestions.",
            usage: "{@rôle}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: [],
            category: "suggest",
            enabled: true
        })
    }
    async run(message, args, data) {

        const role = await message.guild.roles.cache.get(args.join(" ")) 
        || message.guild.roles.resolve(args.join(" ")) 
        || message.mentions.roles.first();

        if (!role || role.name === "@here" || role.name === "@everyone" || role.managed || role.deleted) 
            return message.channel.send(message.client.emotes.nope + " Aucun rôle valide mentionné !");

        if (data.suggestions.role === role.id) return message.channel.send(message.client.emotes.nope + " Le rôle de suggestions est déjà celui-ci.");
        await data.updateOne(
            {
                suggestions: {
                    channel: data.suggestions.channel,
                    role: role.id,
                }
            }
        );
        return message.channel.send(message.client.emotes.yup + " Le rôle de suggestions est désormais " + role.name + " !");
    }
};