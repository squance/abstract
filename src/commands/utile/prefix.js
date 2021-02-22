const Command = require("../../handlers/Command");

module.exports = class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: "prefix",
            description: "Configure le préfixe.",
            args: true,
            message: "Votre préfixe doit être compris entre 1 et 3 caractères.",
            usage: "{prefix}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: [],
            category: "utile",
            enabled: true
        })
    }
    async run(message, args, data) {

        const prefix = args.join(" ");

        if (prefix.length > 3 || prefix.length < 1) {
            return message.channel.send(message.client.emotes.nope + " Votre préfixe doit être compris entre 1 et 3 caractères.");
        } else {

            if (data.prefix === prefix || data.prefix === null && prefix === message.client.config.prefix) {
                return message.channel.send(message.client.emotes.nope + " Le préfixe est déjà celui-ci !");
            } else {
                if (prefix === message.client.config.prefix) {
                    await data.updateOne(
                        {
                            prefix: null
                        }
                    ).catch(error => {
                        return message.client.error(message, error)
                    });
                    return message.channel.send(message.client.emotes.yup + " Le préfixe a bien été réinitialisé !");
                } else {
                    await data.updateOne(
                        {
                            prefix: prefix
                        }
                    ).catch(error => {
                        return message.client.error(message, error)
                    });
                    return message.channel.send(message.client.emotes.yup + "Le préfixe est désormais `" + prefix + "`");
                }
            };

        };
    }
};