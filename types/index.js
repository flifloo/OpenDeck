const db = require("../db.json");

const types = {
    "execCommand": require("./ExecCommand"),
    "deck": require("./Deck"),
    "keys": require("./Keys")
};

module.exports.types = types;

/**
 *
 * @param name
 * @param x
 * @param y
 * @returns {null|Base}
 */
module.exports.getSlot = (name, x, y) => {
    if (name in db.decks)
        if (x in db.decks[name].rows)
            if (y in db.decks[name].rows[x]) {
                let d = db.decks[name].rows[x][y];
                return new types[d.type](d.text, d.image, d.options);
            }
    return null;
};
