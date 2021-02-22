const counterSchema = require("../../models/counter");
const Command = require("../../handlers/Command");

module.exports = class Counter extends Command {
    constructor(client) {
        super(client, {
            name: "counter",
            description: "Configure le compteur (counter).",
            args: true,
            message: "Attention: lorsque le compteur est activé, le seul moyen existant pour le désactiver est la suppression du salon. Qui n'entraînera une suppression des statistiques de compteur que lorsque vous en configurerez un nouveau. Tous les messages du compteur doivent former une suite logique de nombre en utilisant 1 comme pas. Le bot doit posséder la permission de gérer les messages du salon pour pouvoir fonctionner correctement, mais également d'activer un slowmode sur le salon; sans quoi il ne pourra pas vous laisser utiliser le compteur.",
            usage: "{#salon}",
            perm: ["MANAGE_GUILD"],
            botPerm: ["MANAGE_MESSAGES"],
            aliases: [],
            category: "counter",
            enabled: true
        })
    }
    async run(message, args, data) {
      
        const channel = await message.guild.channels.cache.get(args.join(" ")) 
        || message.guild.channels.resolve(args.join(" ")) 
        || message.mentions.channels.first();

        if (!channel || channel.type !== "text") {
            return message.channel.send(message.client.emotes.nope + " Aucun salon strictement de type \`textuel\` mentionné.");
        } else {
            
            if (data.infinity.channel === channel.id) 
                return message.channel.send(message.client.emotes.nope + " Ce salon est déjà celui du compteur.");

            channel.send(message.client.emotes.greenArrow + " Ce salon est désormais en mode compteur, cela signifie que tout message posté ici et ne suivant pas la suite logique de nombres du message précédent sera automatiquement supprimé. Les commandes ne peuvent pas être exécutées dans ce salon.")
            .then(async function(msg) {

                channel.setRateLimitPerUser(5).catch(() => {
                    msg.delete().catch(() => {});
                    return message.chanenl.send(message.client.emotes.nope + " S'il vous plaît, il me faut la permission d'activer un slowmode sur ce salon, sinon je ne peux pas vous laisser activer le compteur.");
                });

                await data.updateOne(
                    {
                        infinity: {
                            channel: channel.id,
                            lastNumber: 0,
                            lastAuthorID: null
                        }  
                    }
                );

                const oldDatas = await counterSchema.find(
                    {
                        guildID: message.guild.id
                    }
                );

                if (oldDatas) {
                    oldDatas.forEach(data => {
                        data.delete();
                    });
                };

                return message.channel.send(message.client.emotes.yup + " Le salon de compteur est désormais <#" + channel.id + "> !");
            })
            .catch(() => {
                return message.channel.send(message.client.emotes.nope + " Hmm, on dirait que je n'ai pas la permission d'envoyer des messages dans ce salon. Ca va être problématique.");
            });
            
        };
    }
};