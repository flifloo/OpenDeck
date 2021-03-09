const db = require("../db.json");
const getSlot = require("../types").getSlot;

module.exports = socket => {
    return async data => {
        let err = null;
        if (data && Array.isArray(data) && data.length === 3) {
            if (db.decks[data[0]]) {
                const el = getSlot(...data);

                if (el) {
                    try {
                        if (el.trigger.constructor.name === "AsyncFunction")
                            await el.trigger(socket);
                        else
                            el.trigger(socket);
                    } catch (exc) {
                        err = "unknown";
                        console.error(exc)
                    }
                } else
                    err = "notFound";
            } else
                err = "deckNotFound";
        } else
            err = "badData";
        if (err)
            socket.emit("trigger", {error: err})
    }
};
