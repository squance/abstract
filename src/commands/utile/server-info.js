const Canvas = require("canvas");
const Discord = require("discord.js");
const Command = require("../../handlers/Command");

module.exports = class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: "server-info",
            description: "Affiche les informations du serveur.",
            args: false,
            message: null,
            usage: null,
            perm: [],
            botPerm: [],
            aliases: ["si", "server"],
            category: "utile",
            enabled: true
        })
    }
    async run(message) {

        // charge canvas
        const canvas = Canvas.createCanvas(800, 237);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage("./assets/server_banner.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // pour affiche rle nom du serveur;
        let name = message.guild.name;
        if (name.length > 13) name = name.substr(0, 11) + "...";
        ctx.font = "bold 60px Myriad Pro";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(name, 252, 138);

        // pour afficher le petit logo de booster
        if (message.guild.premiumSubscriptionCount > 0) {
            const boost = await Canvas.loadImage("./assets/booster.png");
            ctx.drawImage(boost, 673, 84, 70, 70);
        };

        // pour afficher l'icone du serveur
        const serverIcon = await Canvas.loadImage(message.guild.icon ? message.guild.iconURL({format: "png"}) : "./assets/unknown.png");
        ctx.drawImage(serverIcon, 63, 52, 140, 140);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${message.client.user.username}-serverinfo-${message.guild.id}.png`);
        message.channel.send(
            {
                files: [attachment],
                embed: {
                    color: message.client.colors.burple,
                    author: {
                        name: "Informations de serveur",
                        url: message.client.links.invite
                    },
                    image: {
                        url: "attachment://" + attachment.name
                    },  
description: `${message.guild.description ? message.guild.description : ""}

**Membres**
Compte: ${message.guild.memberCount}/${message.guild.maximumMembers}
Bots: ${message.guild.members.cache.filter(m => m.user.bot).size}
Staff: ${message.guild.members.cache.filter(m => m.hasPermission(["BAN_MEMBERS", "MANAGE_MESSAGES", "KICK_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])).size}
Statut des membres: ${message.client.emotes.online} ${message.guild.members.cache.filter(m => ["dnd", "idle", "online"].includes(m.user.presence.status)).size} ${message.client.emotes.offline} ${message.guild.members.cache.filter(m => m.user.presence.status === "offline").size}

**Global**
Région: ${message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1)}
Salon de règles: ${message.guild.rulesChannelID ? `<#${message.guild.rulesChannelID}>` :"aucun"}
Salons: ${message.guild.channels.cache.size}
Rôles: ${message.guild.roles.cache.size} 
Emojis: ${message.guild.emojis.cache.size}
Bannière: ${message.guild.banner ? `[lien](${message.guild.bannerURL({size: 1024})})` : "aucune"}
Palier de boosts: ${message.guild.premiumTier}
Nombre de boosts: ${message.guild.premiumSubscriptionCount}

Features: ${message.guild.features.length > 0 ? message.guild.features.map(v => v.toLowerCase()).join(", ") : "aucun"}
Owner: <@!${message.guild.ownerID}> (${message.guild.owner.user.tag})`
                }

            }
        ).then(i => message.client.deleteThis(message, i));

    }
};