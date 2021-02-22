const { readdir } = require("fs");
const chalk = require("chalk");

module.exports = {
    readFile(file) {
        readdir(file, function(error, fichiers) {
            if (error) {
                return console.error(chalk.red(error));
            } else {
                const arrayElements = file.split("/");
                console.log(chalk.green(file.split("/")[arrayElements[2] !== "" ? 2 : 1].toUpperCase()) + " : " + fichiers.length + " fichiers chargés.")
            };
        });
    }
};