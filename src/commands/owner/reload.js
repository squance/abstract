const Command = require("../../handlers/Command");

module.exports = class Reload extends Command {
    constructor(client) {
        super(client, {
            name: "reload",
            description: "Recharge un fichier.",
            args: true,
            message: null,
            usage: "{commande}",
            perm: [],
            botPerm: [],
            aliases: ["r"],
            category: "owner",
            enabled: true
        })
    }
    async run(message, args, data) {

        const commandName = args.join(" ").toLowerCase();
        const command = message.client.commands.get(commandName) 
        || message.client.commands.find(cmd => cmd.help.aliases.includes(commandName));

        if (!command) return message.channel.send(message.client.emotes.nope + " Aucune commande valide spécifiée.");

        const cmd = command.help;
        delete require.cache[require.resolve(`../${cmd.category}/${cmd.name}`)];

        try {

            const newCommand = new (require(`../${cmd.category}/${cmd.name}`))(message.client);
            message.client.commands.set(newCommand.help.name, newCommand);
            return message.channel.send(message.client.emotes.yup + ` La commande ${newCommand.help.name} a été redémarrée !`).catch(() => {});

        } catch (error) {
            message.client.error(message, error);
        };
    }
};