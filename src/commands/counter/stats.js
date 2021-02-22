const counterSchema = require("../../models/counter");
const Command = require("../../handlers/Command");

module.exports = class Stats extends Command {
    constructor(client) {
        super(client, {
            name: "stats",
            description: "Affiche les statistiques de compteur d'un utilisateur.",
            args: false,
            message: null,
            usage: "{@user}",
            perm: [],
            botPerm: [],
            aliases: ["c-stats", "counter-stats"],
            category: "counter",
            enabled: true
        })
    }
    async run(message, args, data) {
     
        if (data.infinity.channel === null) {
            return message.channel.send(message.client.emotes.nope + " Le counter est désactivé !");
        } else {

            let member;
            if(args.length) {
                member = await message.guild.members.cache.get(args.join(" ")) 
                || message.guild.members.resolve(args.join(" ")) 
                || message.mentions.members.first();
                if (!member) return message.channel.send(message.client.emotes.nope + " Aucun membre valide mentionné.");
            } else {
                member = message.member;
            };

            const memberData = await counterSchema.findOne(
                {
                    userID: member.user.id,
                    guildID: message.guild.id
                }
            );

            if (!memberData) {
                return message.channel.send(message.client.emotes.nope + " Ce membre n'a jamais compté !");
            } else {

                const totalForIndex = await counterSchema.find(
                    {
                        guildID: message.guild.id
                    }
                ).sort(
                    {
                        taotlNombres: -1
                    }
                );

                let arrayOfUserIDs = [];
                totalForIndex.forEach(userData => {
                    arrayOfUserIDs.push(userData.userID);
                });

                const link = `(${message.client.links.invite})`;

                message.channel.send(
                    {
                        embed: {
                            color: message.client.color(),
                            author: {
                                name: "Statistiques de " + member.user.username,
                                iconURL: member.user.displayAvatarURL({dynamic: true})
                            },
                            footer: {
                                text: "ID : " + member.user.id + ", tag : " + member.user.tag
                            },
                            thumbnail: {
                                url: member.user.displayAvatarURL({size: 1024, dynamic: true})
                            },
                            description: `**Rang :** [\`#${arrayOfUserIDs.indexOf(memberData.userID)+1}\`]${link}
                            **Total :** [\`${memberData.totalNombres}\`]${link}
                            **Milliers :** [\`${memberData.totalMilliers}\`]${link}
                            **Centaines :** [\`${memberData.totalCentaines}\`]${link}`
                        }
                    }
                ).catch(() => {});

            };
        };
    }
};