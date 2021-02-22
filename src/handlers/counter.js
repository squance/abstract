// Handler des messages pour le compteur

const counterSchema = require("../models/counter");

module.exports = {
    async handleCounter(message, client, data) {

        let user = await counterSchema.findOne(
            {
                guildID: message.guild.id,
                userID: message.author.id
            }
        );

        if (message.author.id == client.user.id && message.type === "DEFAULT") return;

        if (!user) {
            user = await new counterSchema(
                {
                    guildID: message.guild.id,
                    userID: message.author.id,
                    totalMilliers: 0,
                    totalCentaines: 0,
                    totalNombres: 0,
                    userTag: message.author.tag
                }
            ).save().catch(function error() {
                client.error2(error);
            });
        };

        if (message.author.id === data.infinity.lastAuthorID) {

            return message.delete(
                {
                    timeout: 2
                }
            ).catch(() => {});

        } else {

            if (!message.content && !message.author.bot 
                || message.author.bot && message.author.id !== client.user.id) return message.delete().catch(() => {});
                
            let args = message.content.trim().split(/ +/);
            let number = Math.abs(args[0]);
        
            if (!number) {
                return message.delete().catch(() => {});
            } else {
                if (number === NaN || number === Infinity) return message.delete().catch(() => {});
                number = Math.round(number);
                if (number !== data.infinity.lastNumber+1) return message.delete().catch(() => {});
                const color = client.color();
                
                const users = await counterSchema.find(
                    {
                        guildID: message.guild.id
                    }
                ).sort(
                    {
                        totalNombres: -1
                    }
                );
                const arrayDesID = [];
                users.forEach(utilisateur => {
                    arrayDesID.push(utilisateur.userID);
                });
                const rang = arrayDesID.indexOf(message.author.id)+1;
                const emoji = verifEmoteOfRank(rang, [
                    "<:small_blue_square:810505516563955772>",
                    "🥇", 
                    "🥈", 
                    "🥉"
                ]);
                await data.updateOne(
                    {
                        infinity: {
                            channel: message.channel.id,
                            lastNumber: data.infinity.lastNumber+1,
                            lastAuthorID: message.author.id
                        }
                    }
                );
                let toPin = false;
                // ok, c'est absolument pas optimisé, mais tant pis x')
                if (number.toString().length > 3) {
                    if (verifCentaines(number)) {
                        emoji = "⭐";
                        await user.updateOne(
                            {
                                totalNombres: user.totalNombres+1,
                                userTag: message.author.tag,
                                totalCentaines: user.totalCentaines+1,
                            }
                        );
                    } else if (verifMilliers(number)) {
                        emoji = "💫";
                        await user.updateOne(
                            {
                                totalNombres: user.totalNombres+1,
                                userTag: message.author.tag,
                                totalMilliers: user.totalMilliers+1,
                            }
                        );
                        toPin = true;
                    } else {
                        await user.updateOne(
                            {
                                totalNombres: user.totalNombres+1,
                                userTag: message.author.tag
                            }
                        );
                    }
                } else {
                    await user.updateOne(
                        {
                            totalNombres: user.totalNombres+1,
                            userTag: message.author.tag
                        }
                    );
                }
                args = args.slice(1);

                message.channel.send(
                    {
                        embed: {
                            color: color,
                            description: emoji + ` <@!${message.author.id}>: \`${number}\` ${args.length > 0 ? args.map(argument => argument).join(" ") : ""}`
                        }
                    }
                ).then(msg => {
                    if (toPin) {
                        msg.pin().catch(() => {});
                    };
                    message.delete().catch(() => {});
                });

            };

        };

    }

};

function verifEmoteOfRank(index, emojis) {
    let emoji;
    if(index === 1) {
        emoji = emojis[1]
    } else if(index === 2) {
        emoji = emojis[2]
    } else if(index === 3) {
        emoji = emojis[3]
    } else {
        emoji = emojis[0]
    };
    return emoji;
};

function verifCentaines(number) {
    const nombre = number.toString();
    if (nombre.charAt(nombre.length-1) === "0" && nombre.charAt(nombre.length-2) === "0" && nombre.charAt(nomber.length-3) !== "0") {
        return true;
    } else {
        return false;
    };
};

function verifMilliers(number) {
    const nombre = number.toString();
    if (nombre.charAt(nombre.length-1) === "0" && nombre.charAt(nombre.length-2) === "0" && nombre.charAt(nombre.length-3) === "0") {
        return true;
    } else {
        return false;
    };
};