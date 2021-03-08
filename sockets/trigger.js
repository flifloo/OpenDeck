const db = require("../db.json");

module.exports = socket => {
    return data => {
        let err = null;
        if (data && Array.isArray(data) && data.length === 2) {
            const el = db.deck.rows[data[0]][data[1]];
            if (el) {
                try {
                    const type = require("../types/" + el.type);
                    type.trigger(el, socket);
                } catch (exc) {
                    if (exc.code === "MODULE_NOT_FOUND")
                        err = "typeNotFound";
                    else
                        err = "unknown";
                }
            } else {
                err = "notFound";
            }
        } else
            err = "badData";
        if (err)
            socket.emit("trigger", {error: err})
    }
};
