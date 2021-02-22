const userSchema = require("../../models/users");
const Command = require("../../handlers/Command");

module.exports = class Unblock extends Command {
    constructor(client) {
        super(client, {
            name: "unblock",
            description: "Déloque un utilisateur du starboard.",
            args: true,
            message: "L'utilisateur débloqué peut de nouveau réagir et participer au starboard.",
            usage: "{@user}",
            perm: ["MANAGE_GUILD"],
            botPerm: [],
            aliases: ["sb-unblock"],
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

        if (!member) 
            return message.channel.send(message.client.emotes.nope + " Aucun utilisateur valide mentionné !");

         const userData = await userSchema.findOne(
            {
                guildID: message.guild.id,
                userID: member.user.id
            }
        );
        if (!userData) {
            return message.channel.send(message.client.emotes.nope + " Cet utilisateur n'a jamais été bloqué !");
        } else {
            if (!userData.block) 
                return message.channel.send(message.client.emotes.nope + " Cet utilisateur n'a jamais été bloqué !");
            await userData.updateOne(
                {
                    block: false
                }
            ).catch(error => {
                return message.client.error(message, error);
            });
            return message.channel.send(message.client.emotes.yup + " L'utilisateur " + member.user.tag + " n'est désormais plus bloqué du starboard !");
        };
    }
};