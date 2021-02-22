const Command = require("../../handlers/Command");

module.exports = class Channel extends Command {
    constructor(client) {
        super(client, {
            name: "channel",
            description: "Configure le salon de suggestions.",
            args: true,
            message: "Il est déconseillé de configurer le salon de suggestions dans le salon de compteur, car les suggestions seront automatiquement supprimées.",
            usage: "{#salon}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: [],
            category: "suggest",
            enabled: true
        })
    }
    async run(message, args, data) {

        const channel = await message.guild.channels.cache.get(args.join(" ")) 
        || message.guild.channels.resolve(args.join(" ")) 
        || message.mentions.channels.first();

        if (!channel ) return message.channel.send(message.client.emotes.nope + " Aucun salon de type `textuel` valide mentionné !");
        if (data.suggestions.channel === channel.id) return message.channel.send(message.client.emotes.nope + " Le salon de suggestions est déjà celui-ci.");
        await data.updateOne(
            {
                suggestions: {
                    channel: channel.id,
                    role: data.suggestions.role,
                }
            }
        );
        return message.channel.send(message.client.emotes.yup + ` Le salon de suggestions est désormais <#${channel.id}> !`);
    }
};