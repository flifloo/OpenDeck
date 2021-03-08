const Base = require("./Base");
const { exec } = require('child_process');

class ExecCommand extends Base {
    constructor(text, image = null, options = null) {
        super(text, image, options);
    }

    /**
     * @override
     */
    toJSON() {
        return super.toJSON("execCommand")
    }

    /**
     * @override
     */
    trigger() {
        exec(this.options, (err) => {
            if (err)
                console.error(err);
        });
    }
}

module.exports = ExecCommand;
