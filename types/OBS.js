const Base = require("./Base");
const OBSWebSocket = require('obs-websocket-js');
const db = require("../db.json");

class OBS extends Base {
    static name = "OBS";
    static type = "obs";
    static fields = {
        cmd: {
            type: "select",
            options: ["startStreaming", "stopStreaming", "toggleStreaming", "startRecording", "stopRecording", "toggleRecording"],
            name: "Action",
            required: true
        }
    };
    static obs = new OBSWebSocket();

    constructor(text, image = null, options = null) {
        super(text, image, options);
    }

    static config() {
        return {
            host: {
                type: "text",
                name: "Address",
                required: true,
                value: db.types[OBS.type].host,
            },
            port: {
                type: "number",
                name: "Port",
                required: true,
                value: db.types[OBS.type].port,
            },
            password: {
                type: "password",
                name: "password",
                value: db.types[OBS.type].password
            }
        }
    };

    /**
     * @override
     */
    static saveConfig(configuration) {
        super.saveConfig(OBS.type, configuration)
    }

    /**
     * @override
     */
    static staticToJSON() {
        return super.staticToJSON(OBS.name, OBS.type, OBS.fields, OBS.config());
    }

    /**
     * @override
     */
    toJSON() {
        return super.toJSON(OBS.type)
    }

    static async connect() {
        const config = OBS.config();
        try {
            await OBS.obs.connect({
                address: config.host.value + ":" + config.port.value,
                password: config.password.value
            });
            return true;
        } catch (err) {
            console.error("Fail to connect !");
            console.error(err);
            return false;
        }
    }

    /**
     * @override
     */
    async trigger(socket) {
        try {
            switch (this.options.cmd) {
                case "startStreaming":
                    await OBS.obs.send("StartStreaming");
                    break;
                case "stopStreaming":
                    await OBS.obs.send("StopStreaming");
                    break;
                case "toggleStreaming":
                    try {
                        await OBS.obs.send("StartStreaming");
                    } catch (err) {
                        if (err.error === "streaming already active")
                            await OBS.obs.send("StopStreaming");
                        else
                            throw err;
                    }
                    break;
                case "startRecording":
                    await OBS.obs.send("StartRecording");
                    break;
                case "stopRecording":
                    await OBS.obs.send("StopRecording");
                    break;
                case "toggleRecording":
                    try {
                        await OBS.obs.send("StartRecording");
                    } catch (err) {
                        if (err.error === "recording already active")
                            await OBS.obs.send("StopRecording");
                        else
                            throw err;
                    }
                    break;
            }
        } catch (err) {
            switch (err.error) {
                case "There is no Socket connection available.":
                    if (!await OBS.connect())
                        socket.emit("trigger", {error: "failToConnectOBS"});
                    else
                        this.trigger(socket);
                    break;
                case "streaming already active":
                    console.error("Streaming already active");
                    break;
                case "streaming not active":
                    console.error("Streaming not active");
                    break;
                case "recording already active":
                    console.error("Recording already active");
                    break;
                case "recording not active":
                    console.error("Recording not active");
                    break;
                default:
                    throw err;
            }
        }
    }
}

if (!(OBS.type in db.types)) {
    db.types[OBS.type] = {};
    OBS.write();
}

OBS.obs.on("error", err => {
    console.error("socket error:", err);
});

module.exports = OBS;
