const Command = require("../../handlers/Command");

module.exports = class Number extends Command {
    constructor(client) {
        super(client, {
            name: "number",
            description: "Configure le nombre de réactions du starboard.",
            args: true,
            message: "Le nombre de réactions du starboard est le nombre de réactions :star: qu'un message doit avoir pour être posté dans le starboard. Ce nombre doit être compris entre 1 et 15",
            usage: "{nombre}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-number"],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {

        const number = parseInt(Math.abs(args[0]));
        if (number === NaN || number === Infinity || number > 15 || number < 1) return message.channel.send(message.client.emotes.nope + " Aucun nombre valide compris entre 1 et 15 spécifié.");
        
        if (data.starboard.reactionNumber === number) return message.channel.send(message.client.emotes.nope + " Le nombre de réactions à avoir est déjà celui-ci !");
        await data.updateOne(
            {
                starboard: {
                    active: data.starboard.active,
                    channel: data.starboard.channel,
                    selfstaring: data.starboard.selfstaring,
                    reactionNumber: number,
                    autoreact: data.starboard.autoreact,
                    blacklistedChannels: data.starboard.blacklistedChannels,
                },
            }
        ).catch(error => {
            return message.client.error(message, error);
        });
        return message.channel.send(message.client.emotes.yup + " Le nombre de réactions est désormais " + number.toString());
    }
};