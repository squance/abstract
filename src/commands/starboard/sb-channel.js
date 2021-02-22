const Command = require("../../handlers/Command");

module.exports = class StarboardChannel extends Command {
    constructor(client) {
        super(client, {
            name: "sb-channel",
            description: "Configure le salon du starboard.",
            args: true,
            message: "Il est déconseillé de configurer le salon de starboard dans le salon de compteur, car les messages seront automatiquement supprimés.",
            usage: "{#salon}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: [],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {
       
        const channel = await message.guild.channels.cache.get(args.join(" ")) 
        || message.guild.channels.resolve(args.join(" ")) 
        || message.mentions.channels.first();

        if (!channel ) 
            return message.channel.send(message.client.emotes.nope + " Aucun salon de type `textuel` valide mentionné !");

        if (data.starboard.channel === channel.id) return message.channel.send(message.client.emotes.nope + " Le salon de starboard est déjà celui-ci.");
        await data.updateOne(
            {
                starboard: {
                    active: true,
                    channel: channel.id,
                    selfstaring:  data.starboard.selfstaring !== null ? data.starboard.selfstaring : true,
                    reactionNumber:  data.starboard.reactionNumber,
                    autoreact:  data.starboard.autoreact,
                    blacklistedChannels:  data.starboard.blacklistedChannels,
                }
            }
        );
        return message.channel.send(message.client.emotes.yup + ` Le salon de starboard est désormais <#${channel.id}> !`);
    }
};


// lol, même code que pour le salon de suggestions.