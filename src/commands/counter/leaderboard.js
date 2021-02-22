const counterSchema = require("../../models/counter");
const Command = require("../../handlers/Command");

module.exports = class Leaderboard extends Command {
    constructor(client) {
        super(client, {
            name: "leaderboard",
            description: "Affiche le classement des meilleurs compteurs.",
            args: false,
            message: null,
            usage: null,
            perm: [],
            botPerm: [],
            aliases: ["c-leaderboard", "c-lead", "c-top", "counter-top", "counter-lead", "top", "counter-leaderboard"],
            category: "counter",
            enabled: true
        })
    }
    async run(message, args, data) {

        if (data.infinity.channel === null) {
            return message.channel.send(message.client.emotes.nope + " Le counter est désactivé !");
        } else {

            const total = await counterSchema.find(
                {
                    guildID: message.guild.id
                }
            ).sort(
                {
                    totalNombres: -1
                }
            ).limit(20);

            if(!total) {
                return message.channel.send(message.client.emotes.nope + " Aucune donnée trouvée !");
            } else {

                let arrayOfUserIDs = [], arrayOfSentences = [];

                total.slice(0, 20).forEach(userData => {
                    arrayOfUserIDs.push(userData.userID);
                    arrayOfSentences.push(verifRankOfUser(arrayOfUserIDs.indexOf(userData.userID)+1) + ` ${verifUser(userData.userID, message.guild) ? `<@!${userData.userID}>` : userData.userTag} ➟ \`${userData.totalNombres}\``);
                });

                message.channel.send(
                    {
                        embed: {
                            color: message.client.color(),
                            author: {
                                name: "Classement des meilleurs compteurs",
                                iconURL: message.guild.iconURL({ dynamic: true })
                            },
                            description: arrayOfSentences.join("\n")
                        }
                    }
                ).catch(() => {});

            };
        };
    }
};

function verifRankOfUser(rank) {
    const index = rank.toString();
    let number;
    switch (index) {
        case "1":
            number = index.replace("1", "🏆");
            break;
        case "2":
            number = index.replace("2", "🥈");
            break;
        case "3":
            number = index.replace("3", "🥉");
            break;
        default:
            number = `**#${index}**`;
            break;
    };
    return number;
};

function verifUser(ID, guild) {
    if (guild.members.cache.has(ID)) {
        return true;
    } else {
        return false;
    }
};