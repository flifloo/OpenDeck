const db = require("../db.json");


module.exports.trigger = (el, socket) => {
    if (typeof el.options === "string") {
        socket.emit("getDeck", {name: el.options, data: db.decks[el.options]});
    }
    else
        socket.emit("trigger", {error: "invalidOptions"});
};
