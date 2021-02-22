const Command = require("../../handlers/Command");

module.exports = class Liens extends Command {
    constructor(client) {
        super(client, {
            name: "liens",
            description: "Affiche les différents liens du bot.",
            args: false,
            message: null,
            usage: null,
            perm: [],
            botPerm: [],
            aliases: ["links", "invite", "support", "github", "doc", "documentation", "invitation"],
            category: "utile",
            enabled: true
        })
    }
    async run(message) {

        message.channel.send(
            {
                embed: {
                    color: message.client.colors.burple,
                    title: "Liens de " + message.client.user.username,
                    url: message.client.links.invite,
                    thumbnail: {
                        url: message.client.user.displayAvatarURL({size: 1024})
                    },
                    description: `Invitation sur votre serveur: <${message.client.links.invite}>\nServeur support: ${message.client.links.support}\nGithub: ${message.client.links.github}\nDocumentation: ${message.client.links.documentation}`
                }
            }
        );
    }
};