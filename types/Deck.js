const Base = require("./Base");
const db = require("../db.json");


class Deck extends Base {
    static name = "Deck";
    static type = "deck";

    constructor(text, image = null, options = null) {
        super(text, image, options);
    }

    static fields() {
        return {
            deck: {
                type: "select",
                options: Object.keys(db.decks),
                name: "Deck",
                required: true,
            }
        };
    }

    /**
     * @override
     */
    static staticToJSON() {
        return super.staticToJSON(Deck.name, Deck.type, Deck.fields());
    }

    /**
     * @override
     */
    toJSON() {
        return super.toJSON(Deck.type)
    }

    /**
     * @override
     */
    trigger(socket) {
        if (this.options && typeof this.options.deck === "string") {
            socket.emit("getDeck", {name: this.options.deck, data: db.decks[this.options.deck]});
        } else
            socket.emit("trigger", {error: "invalidOptions"});
    }
}

module.exports = Deck;
