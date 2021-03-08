const db = require("../db.json");
const getSlot = require("../types").getSlot;


module.exports = socket => {
    return data => {
        let name = data.name, slot = data.slot;
        if (db.decks[name]) {
            let s = getSlot(name, ...slot);
            if (s)
                socket.emit("getSlot", {name: name, data: s.toJSON(), position: slot});
            else
                socket.emit("getSlot", {name: name, data: null, position: slot});
        }
        else
            socket.emit("getSlot", {error: "deckNotFound"});
    }
};
