const Discord = require('discord.js');
const { EmojiAPI } = require("emoji-api");
const Command = require("../../handlers/Command");

module.exports = class Emote extends Command {
    constructor(client) {
        super(client, {
            name: "emote",
            description: "Agrandit un emoji.",
            args: true,
            message: "Certains emojis ne sont pas supportés et certains peuvent être \"mal\" supportés.",
            usage: "{emoji}",
            perm: [],
            botPerm: ["ATTACH_FILES"],
            aliases: ["jumbo", "emoji"],
            category: "utile",
            enabled: true
        })
    }
    async run(message, args) {

      
        // supporte les emojis basiques
        if (args[0].charCodeAt(0) >= 55296) {

            const emoji = new EmojiAPI();
            emoji.get(args.join(" ")).then(async(emote) => {

                if (emote.images[5] && emote.images[5].vendor === "Twitter") {
                    const fichier = new Discord.MessageAttachment(emote.images[5].url, `${message.client.user.username}.png`)
                    return message.channel.send({
                        files: [fichier]
                    })

                } else {
                    return message.channel.send(message.client.emotes.nope + " Cet emoji n'est pas supporté.");
                };
            }).catch(function(error) {
                return message.client.error(message, error);
            });

        } else {  
            //supporte les emojis customisés
            const type = args.join(" ").startsWith("<a:") ? ".gif" : ".png";
            const match = args.join(" ").startsWith("<a:") ? args.join(" ").match(/<a:[a-zA-Z0-9_-]+:(\d{18})>/) : args.join(" ").match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);
    
            if(!match || !match[1]) {
                return message.channel.send(message.client.emotes.nope +" Aucun emoji valide spécifié.");
            } else {

                const attachment = new Discord.MessageAttachment(`https://cdn.discordapp.com/emojis/${match[1]}${type}`, `${message.client.user.username}-${match[1]}${type}`);
                
                message.channel.send({
                    files: [attachment]
                });

            };
        };
    }
};