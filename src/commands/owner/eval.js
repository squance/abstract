const { clean } = require("../../functions/clean");
const Command = require("../../handlers/Command");

module.exports = class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Evalue un code donné.",
            args: true,
            message: null,
            usage: "{code}",
            perm: [],
            botPerm: [],
            aliases: ["e"],
            category: "owner",
            enabled: true
        })
    }
    async run(message, args, data) {

        const regex = new RegExp(/(```)?(?:(\S*)\s)(\s*\S[\S\s]*)(```)/);
        /**
         *      Avec cette regex, il vous est possible d'évaluer un code depuis discord en utilisant le bloc.
         *      Par exemple :
         *                  !eval ```js
         *                     console.log(this.client.emotes)
         *                  ```
         */

        const match = args.join(" ").match(regex);

        let toEval = match ? match[3] : args.join(" ");
        
        try {
            let code = eval(toEval);

            if (typeof code !== "string") {
                code = require("util").inspect(code, {
                    depth: 0
                });
            };

            code = clean(code); // décidément, on a tous une fonction clean qui est exactement la même ;-;
         
            message.channel.send({
                embed: {
                    color: message.client.colors.vert,
                    fields: [
                       
                        {
                            name: "Input",
                            value: `\`\`\`js\n${toEval}\`\`\``
                        },
                        {
                            name: "Output",
                            value: `\`\`\`js\n${code.length > 1000 ? code.substr(0, 1000) + ` ...${code.length-1000}` : code}\`\`\``
                        }
                    ]
                }
            }).then(msg => {
                message.client.deleteThis(message, msg);
            });
            
        } catch (err) {

            const error = clean(err);
            message.channel.send({
                embed: {
                    color: message.client.colors.rouge,
                    fields: [
                       
                        {
                            name: "Input",
                            value: `\`\`\`js\n${toEval}\`\`\``
                        },
                        {
                            name: "Output",
                            value: `\`\`\`js\n${error.length > 1000 ? error.substr(0, 1000) + ` ...${error.length-1000}` : error}\`\`\``
                        }
                    ]
                }
            }).then(msg => {
                message.client.deleteThis(message, msg);
            });
        }
    }
};