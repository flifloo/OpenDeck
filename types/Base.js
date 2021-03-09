const db = require("../db.json");
const fs = require("fs");

/**
 * @abstract
 */
class Base {
    static name = "Base";

    constructor(text, image = null, options = null) {
        this.text = text;
        this.image = image;
        this.options = options;
    }

    trigger() {
        return;
    };

    save(name, position) {
        if (!(position[0] in db.decks[name].rows))
            db.decks[name].rows[position[0]] = {};
        db.decks[name].rows[position[0]][position[1]] = this.toJSON();
        Base.#write()
    }

    remove(name, position) {
        if (position[0] in db.decks[name].rows && position[1] in db.decks[name].rows[position[0]]) {
            delete db.decks[name].rows[position[0]][position[1]];
            Base.#write();
            return true;
        }
        return false;
    }

    static #write() {
        fs.writeFileSync("./db.json", JSON.stringify(db));
    }

    static staticToJSON(name, type, fields) {
        return {
            "name": name,
            "type": type,
            "fields": fields
        }
    }

    toJSON(type) {
        return {
            "text": this.text,
            "image": this.image,
            "type": type,
            "options": this.options
        }
    }
}

module.exports = Base;
