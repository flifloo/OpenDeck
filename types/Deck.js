const Base = require("./Base");
const db = require("../db.json");


class Deck extends Base {
    constructor(text, image = null, options = null) {
        super(text, image, options);
    }

    /**
     * @override
     */
    toJSON() {
        return super.toJSON("deck")
    }

    /**
     * @override
     */
    trigger(socket) {
        if (typeof this.options === "string") {
            socket.emit("getDeck", {name: this.options, data: db.decks[this.options]});
        } else
            socket.emit("trigger", {error: "invalidOptions"});
    }
}

module.exports = Deck;
