const chalk = require("chalk");

module.exports = async(client, guild) => {

    if (!guild || guild.unavailable) return;
    const addChannel = await client.guilds.resolve(client.privateGuild).channels.resolve(client.privateChannels.add);
    const date = guild.createdAt
    const year = date.getFullYear()
    const day = date.getDate()
    const month = date.getMonth()

    addChannel.send(
        {
            embed: {
                color: client.colors.vert,
                title: guild.name + " a ajouté " + client.user.username,
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
        console.error(chalk.red("Aucun salon pour log les ajouts de " + client.user.username +" trouvé... Veuillez en spécifier un."))
    });

    let frenchMessage = `👋 Salut, je suis ${client.user.username} !

    Avant de débuter, voici quelques informations... 💝
    Si vous avez une question, n'hésitez pas à la poser ici: <${client.links.support}>

    ${client.user.username} est toujours en développement, donc il est possible que vous rencontriez certains bugs, mais ne vous en faites pas, ils sont corrigés très rapidement !

    Mon préfixe sur ce serveur est \`!\`, mais vous pouvez le changer en tapant \`!prefix <nouveau préfixe>\` !!!
    Et encore, merci de m'avoir ajouté, j'espère que je serais à la hauteur de vos attentes !`;

    if (guild.channels.cache.size > 0) {
        const channel = await guild.channels.cache.filter(salon => salon.rawPosition === 0).first();
        if (channel) {
            channel.send(frenchMessage).catch(function() {
                guild.owner.send(frenchMessage).catch(() => {});
            });
        } else {
            guild.owner.send(frenchMessage).catch(() => {});
        };
    } else {
        guild.owner.send(frenchMessage).catch(() => {});
    };

};