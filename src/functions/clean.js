module.exports = {
    clean(code) {
        if (typeof code === "string") {
            return code.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else {
            return code;
        };
    }
};