// fonction qui ajoute 1 au nombre total de commandes exécutées...

const commandCounter = require("./../models/commandCounter");
const chalk = require("chalk");

module.exports = {
    async addCmd(nombre) {
        let totalData = await commandCounter.findOne(
            {
                AbstractID: "810541534184472636"
            }
        );
        if (totalData) {
            await totalData.updateOne(
                {
                    nombre: totalData.nombre + nombre
                }
            );
        } else {
            await new commandCounter(
                {
                    AbstractID: "810541534184472636",
                    nombre: 1
                }
            ).save().catch(function(error) {
                console.error(chalk.red(error));
            });
        };
    }
};