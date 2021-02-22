const userSchema = require("../../models/users");
const Command = require("../../handlers/Command");

module.exports = class Block extends Command {
    constructor(client) {
        super(client, {
            name: "block",
            description: "Bloque un utilisateur du starboard.",
            args: true,
            message: "Lorsqu'il est bloqué, l'utilisateur ne peut plus réagir à aucun message.",
            usage: "{@user}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-block"],
            category: "starboard",
            enabled: true
        })
    }
    async run(message, args, data) {
      
        if (!data.starboard.active) 
            return message.channel.send(message.client.emotes.nope + " Le starboard n'est pas activé.");

        const member = await message.guild.members.cache.get(args.join(" ")) 
        || message.guild.members.resolve(args.join(" ")) 
        || message.mentions.members.first();

        if (!member) return message.channel.send(message.client.emotes.nope + " Aucun utilisateur valide mentionné !");
        if (member.permissions.has("MANAGE_GUILD")) 
            return message.channel.send(message.client.emotes.nope + " Vous ne pouvez pas bloquer les utilisateurs qui possèdent la permission de gérer le serveur.");

        const userData = await userSchema.findOne(
            {
                guildID: message.guild.id,
                userID: member.user.id
            }
        );

        if (!userData) {

            await new userSchema(
                {
                    guildID: message.guild.id,
                    userID: member.user.id,
                    block: true
                }
            ).save().catch((e) => {return message.client.error(message, e)});

        } else {

            if (userData.block) return message.channel.send(message.client.emotes.nope + " Cet utilisateur est déjà bloqué du starboard.");
            await userData.updateOne(
                {
                    block: true
                }
            ).catch(error => {
                return message.client.error(message, error);
            });

        };
        return message.channel.send(message.client.emotes.yup + " L'utilisateur " + member.user.tag + " a bien été bloqué du starboard !");
    }
};