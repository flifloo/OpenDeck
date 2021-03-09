const db = require("../db.json");


module.exports = socket => {
    return () => {
        socket.emit("getDecks", Object.keys(db.decks));
    }
};
