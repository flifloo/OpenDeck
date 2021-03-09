const Base = require("./Base");
const ks = require('node-key-sender');


class Keys extends Base {
    static name = "Keys";
    static type = "keys";
    static fields = {
        keys: {
            type: "text",
            name: "Keys",
            helper: "Key separated by a comma, if combo use +"
        }
    };

    constructor(text, image = null, options = null) {
        super(text, image, options);
    }

    /**
     * @override
     */
    static staticToJSON() {
        return super.staticToJSON(Keys.name, Keys.type, Keys.fields);
    }

    /**
     * @override
     */
    toJSON() {
        return super.toJSON(Keys.type)
    }

    /**
     * @override
     */
    async trigger() {
        let keys = this.options.keys.split(",");
        let toSend = [];

        for (const key of keys)
            if (key.match(/\S\+\S/))
                toSend.push([ks.sendCombination, key.split("+")]);
            else if (toSend.length !== 0 && toSend[toSend.length-1][0] === ks.sendKeys)
                toSend[toSend.length-1][1].push(key);
            else
                toSend.push([ks.sendKeys, [key]]);

        for (const send of toSend)
            await send[0](send[1]);
    }
}

module.exports = Keys;
