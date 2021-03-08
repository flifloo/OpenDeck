const Base = require("./Base");
const { exec } = require('child_process');

class ExecCommand extends Base {
    static name = "Exec command";
    static type = "execCommand";
    static fields = {
        cmd: {
            type: "text",
            name: "Command"
        }
    };

    constructor(text, image = null, options = null) {
        super(text, image, options);
    }

    /**
     * @override
     */
    static staticToJSON() {
        return super.staticToJSON(ExecCommand.name, ExecCommand.type, ExecCommand.fields);
    }

    /**
     * @override
     */
    toJSON() {
        return super.toJSON(ExecCommand.type)
    }

    /**
     * @override
     */
    trigger() {
        exec(this.options.cmd, (err) => {
            if (err)
                console.error(err);
        });
    }
}

module.exports = ExecCommand;
