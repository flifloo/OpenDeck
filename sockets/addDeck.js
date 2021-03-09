const db = require("../db.json");
const fs = require("fs");


module.exports = socket => {
    return data => {
        if (data.name in db.decks)
            socket.emit("addDeck", {error: "nameAlreadyTaken"});
        else {
            db.decks[data.name] = {
                x:data.x,
                y:data.y,
                rows: {}
            };
            fs.writeFileSync("./db.json", JSON.stringify(db));

            socket.emit("addDeck", data.name);
            socket.broadcast.emit("addDeck", data.name)
        }
    }
};
