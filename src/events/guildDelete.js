const serverSchema = require("../models/server");
const counterSchema = require("../models/counter");
const snipeSchema = require("../models/snipe");
const suggestSchema = require("../models/suggestions");
const chalk = require("chalk");

module.exports = async(client, guild) => {
    
    const removeChannel = await client.guilds.resolve(client.privateGuild).channels.resolve(client.privateChannels.remove);
    const date = guild.createdAt
    const year = date.getFullYear()
    const day = date.getDate()
    const month = date.getMonth()

    removeChannel.send(
        {
            embed: {
                color: client.colors.rouge,
                title: guild.name + " a retiré " + client.user.username,
                description: `Server : ${guild.name} (${guild.id})
                Owner : ${guild.owner.user.username} (${guild.ownerID})
                Membres : ${guild.memberCount}
                Date de création : ${day}/${month+1}/${year}`,
                thumbnail: {
                    url: guild.iconURL(
                        {
                            dynamic: true,
                            size: 1024
                        }
                    )
                }
            }
        }
    ).catch(function() {
        console.error(chalk.red("Aucun salon pour log les retraits de " + client.user.username + " trouvé... Veuillez en spécifier un."))
    });

    const data = await serverSchema.findOne(
        {
            guildID: guild.id
        }
    );

    const counterStats = await counterSchema.find(
        {
            guildID: guild.id
        }
    );

    const snipe = await snipeSchema.findOne(
        {
            guildID: guild.id
        }
    );

    const suggestions = await suggestSchema.find(
        {
            guildID: guild.id
        }
    );

    if (data) {
        data.delete().catch(function(error) {
            console.error(chalk.red(error))
        });
    };
    if (snipe) {
        data.delete().catch(function(error) {
            console.error(chalk.red(error))
        });
    };
    if (counterStats) {
        counterStats.forEach(compteur => {
            compteur.delete();
        });
    };
    if (suggestions) {
        suggestions.forEach(suggest => {
            suggest.delete();
        });
    };

};