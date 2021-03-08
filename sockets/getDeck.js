const db = require("../db.json");


module.exports = socket => {
    return name => {
        if (!name)
            name = "default";
        socket.emit("getDeck", {name: name, data: db.decks[name]});
    }
};
