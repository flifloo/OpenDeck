const db = require("../db.json");
const fs = require("fs");


module.exports = socket => {
    return data => {
        if (!(data in db.decks))
            socket.emit("deleteDeck", {error: "deckNotFound"});
        else {
            delete db.decks[data];
            fs.writeFileSync("./db.json", JSON.stringify(db));

            socket.emit("deleteDeck", data);
            socket.broadcast.emit("deleteDeck", data)
        }
    }
};
