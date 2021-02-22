/**
 * 
 *          ABSTRACT, 2020-2021, par Squance#3682
 *          
 *              Un bot simple et basique mais original pour gérer votre serveur <3
 * 
 *              Lisez la license et le README lol.
 * 
 *
 *                   _           _                         _   
 *                 | |         | |                       | |  
 *            __ _ | |__   ___ | |_  _ __   __ _   ___  | |_ 
 *           / _` || '_ \ / __|| __|| '__| / _` | / __|| __|
 *          | (_| || |_) |\__ \| |_ | |   | (_| || (__ | |_ 
 *           \__,_||_.__/ |___/ \__||_|    \__,_| \___| \__|        lol merci la commande ascii de l'autre bot
 *                                               
 **/

const fs = require('fs');
const Abstract = require("./src/handlers/Client");
const client = new Abstract(
        { 
            partials: [ "REACTION", "MESSAGE", "CHANNEL" ], 
            disableMentions: "everyone" 
        }
    );
const chalk = require("chalk");


const connect = async () => {
 
    // HANDLER DES COMMANDES
    const directories = fs.readdirSync(
        "./src/commands/", 
        { 
            withFileTypes: true 
        }
    );

    directories.forEach(async function(dir) {

        const commands = fs.readdirSync(
            "./src/commands/" + dir.name + "/", 
            { 
                withFileTypes: true 
            }
        );

        commands.filter(cmd => cmd.name.endsWith("js")).forEach(function(cmd) {
            
            try {

                const command = new (require(`./src/commands/${dir.name}/${cmd.name}`))(client);

                client.commands.set(command.help.name, command);
           
            } catch (error) {

                throw new Error(chalk.red(`Impossible de charger la commande ${cmd.name}.\n${error}`));

            };
            
        })

    })

    client.on('ready', function() {

        console.log(`${chalk.cyan(client.user.username)} est désormais en ligne :`);
        console.log(`Il sert ${chalk.cyan(client.users.cache.size)} utilisateurs`);
        console.log(`\ \ \ \ \ \ \ \ ${chalk.cyan(client.guilds.cache.size)} serveurs`);
        console.log(`\ \ \ \ \ \ \ \ ${chalk.cyan(client.channels.cache.size)} salons`);
        console.log(`\ \ \ \ \ \ \ \ ${chalk.cyan(client.emojis.cache.size)} emojis`);
        console.log(`\ \ \ \ \ \ \ \ ${chalk.cyan(client.commands.size)} commandes`);

    })
    
    // HANDLER DES EVENTS
    fs.readdir("./src/Events/", function(error, files) {
    
        if (error) return client.error2(error)

        console.log(`${files.length} évènements chargés !`);
    
        files.forEach((file) => {

            const events = require(`./src/Events/${file}`);

            const event = file.split(".")[0];

            client.on(event, events.bind(null, client));
            
        });
    
    })
    
    // JUSTE DES INDICATIONS QUI DISENT QUELS FICHIERS ONT ETE LUS <3
    const { readFile } = require("./src/functions/readFile");

    let files = ["./assets/", "./src/functions", "./src/handlers"];

    console.log("-".repeat(30));

    for (let i = 0; i < files.length; i++) readFile(files[i]);

    client.connectToDatabase()

    client.login(client.config.token);

};

connect();