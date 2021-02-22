const { Collection } = require("discord.js");
const cooldowns = new Collection();
const cooldownsDesCooldowns = new Collection(); // assez inutile, vous pouvez le retirer si vous voulez avec le code qu'il y a, mais c'est pour empêcher le spam du message de cooldown x')
const serverSchema = require("./../models/server");
const { addCmd } = require("./../functions/addCmd");
const { handleCounter } = require("./../handlers/counter");
const chalk = require("chalk");

module.exports = async(client, message) => {
    if (!message.guild || message.guild.unavailable) return;
    let data = await serverSchema.findOne(
        {
            guildID: message.guild.id,
        }
    );
    if (!data) {
        data = await new serverSchema(
            {
                guildID: message.guild.id,
                prefix: null,
                premium: false,
                blacklisted: false,
                suggestions: {
                    channel: null,
                    role: null,
                },
                starboard: {
                    active: false,
                    channel: null,
                    selfstaring: true,
                    reactionNumber: 1,
                    autoreact: false,
                    blacklistedChannels: [],
                },
                infinity: {
                    channel: null,
                    lastNumber: 0,
                    lastAuthorID: null
                }
            }
        ).save().catch(function(error) {
            console.error(chalk.red(error));
        });
    };
    const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);
    const prefix = findPrefix(data, client);

    if (message.channel.id === data.infinity.channel) {
        handleCounter(message, client, data);
    } else {

        if (message.content.toLowerCase().startsWith(prefix) && verifyType(message) !== true && !message.author.bot) {

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
            if (!command || message.author.id !== client.ownerID && command.help.category === "owner") return;

            if (message.author.id !== client.ownerID) {

                // handler du cooldown des commandes, c'est un gros b*rdel
                if (!cooldowns.has(message.author.id)) {
                    cooldowns.set(message.author.id, new Collection());
                };
                const timestamps = cooldowns.get(message.author.id);
                const date = Date.now();
                const cooldown = 5*1000;

                if (timestamps.has(message.author.id)) {

                    const endOfCooldown = timestamps.get(message.author.id) + cooldown;
                    if (endOfCooldown > date) {

                        if (!cooldownsDesCooldowns.has(message.author.id)) {
                            cooldownsDesCooldowns.set(message.author.id, new Collection());
                        };

                        const timestampsBis = cooldownsDesCooldowns.get(message.author.id);
                        const dateBis = Date.now();
                        const cooldownBis = 2*1000;

                        if (timestampsBis.has(message.author.id)) {
                            const endOfCooldownBis = timestampsBis.get(message.author.id) + cooldownBis;
                            if (endOfCooldownBis > dateBis) return;
                        }

                        timestampsBis.set(message.author.id, dateBis);

                        setTimeout(function() {
                            timestampsBis.delete(message.author.id)
                        }, cooldownBis);

                        return message.channel.send("**Cooldown :** veuillez patienter 5 secondes entre chaque commande. :hourglass_flowing_sand:").then(msg => {
                            msg.delete(
                                {
                                    timeout: 5*1000 // 5 secondes
                                }
                            )
                        })
                    };
                };

                timestamps.set(message.author.id, date);

                setTimeout(function() {
                    timestamps.delete(message.author.id);
                }, cooldown);

            };

            if (message.author.id !== client.ownerID && command.help.enabled === false) return message.channel.send(client.emotes.nope + " Cette commande est temporairement désactivée.");
            if (!message.guild.me.hasPermission(command.help.botPerm)) return message.channel.send(client.emotes.nope + " Je ne peux pas faire ça !");
            if (message.author.id !== client.ownerID) {
                if (!message.member.hasPermission(command.help.perm)) return message.channel.send(client.emotes.nope + " Tu ne peux pas faire ça !");
            };

            addCmd(1);
            client.log(`**Commande exécutée**
            **nom** : ${command.help.name}
            **user** : <@${message.author.id}> (${message.author.id})
            **tag** : ${message.author.tag}
            **serveur** : ${message.guild.name} (${message.guild.id})`);

            if (command.help.args && !args.length && command.help.usage !== null) {
            
                return message.channel.send(
                    {
                        embed: {
                            color: client.colors.rouge,
                            description: client.emotes.redSmallSquare +
                            " " + prefix + command.help.name + " " + command.help.usage + 
                            ` ${command.help.message ? "\n\n" + command.help.message : ""}`,
                        }
                    }
                );
            
            };

            try {
                command.run(message, args, data);
            } catch (error) {
                client.error(message, error);
            };

        } else {
            if (message.content.match(mentionRegex)) {
                message.channel.send(`Salut ! Mon préfixe sur ce serveur est \`${prefix}\``)
                .catch(() => {});
            };
        };

    };

};

function findPrefix(data, client) {
    if (data.prefix !== null) {
        return data.prefix;
    } else {
        return client.config.prefix;
    };
};

function verifyType(message) {
    let MessageTypes=  [
        'RECIPIENT_ADD',
        'RECIPIENT_REMOVE',
        'CALL',
        'CHANNEL_NAME_CHANGE',
        'CHANNEL_ICON_CHANGE',
        'PINS_ADD',
        'GUILD_MEMBER_JOIN',
        'USER_PREMIUM_GUILD_SUBSCRIPTION',
        'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
        'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
        'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3',
        'CHANNEL_FOLLOW_ADD',
        null,
        'GUILD_DISCOVERY_DISQUALIFIED',
        'GUILD_DISCOVERY_REQUALIFIED'
    ]
    if(MessageTypes.includes(message.type)) return true
    else return false;
};