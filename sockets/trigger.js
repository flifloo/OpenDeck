const db = require("../db.json");

module.exports = socket => {
    return data => {
        let err = null;
        if (data && Array.isArray(data) && data.length === 3) {
            if (db.decks[data[0]]) {
                const el = db.decks[data[0]].rows[data[1]][data[2]];

                if (el) {
                    try {
                        const type = require("../types/" + el.type);
                        type.trigger(el, socket);
                    } catch (exc) {
                        if (exc.code === "MODULE_NOT_FOUND")
                            err = "typeNotFound";
                        else {
                            err = "unknown";
                            console.error(exc)
                        }
                    }
                } else {
                    err = "notFound";
                }
            } else
                err = "deckNotFound";
        } else
            err = "badData";
        if (err)
            socket.emit("trigger", {error: err})
    }
};
