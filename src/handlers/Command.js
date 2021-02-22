// Classe des commandes

class Command {
    constructor(client, {
        name = null,
        description = null,
        args = false,
        message = null,
        usage = null,
        perm = [],
        botPerm = [],
        aliases = [],
        category = null,
        enabled = true
    })
    {
        this.client = client;
        this.help = {
            name,
            description,
            args,
            message,
            usage,
            perm,
            botPerm,
            aliases,
            category,
            enabled
        }

        this.findPrefix = (data) => {
            if (data.prefix !== null) {
                return data.prefix;
            } else {
                return this.client.config.prefix;
            };
        }
        this.send = (message, content) => {
            message.channel.send(content).catch(() => {});
        }
    }
};
module.exports = Command;