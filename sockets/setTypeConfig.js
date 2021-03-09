const { types } = require("../types");


module.exports = socket => {
    return data => {
        if (data.type && data.configuration) {
            try {
                const type = types[data.type], config = type.config();
                for (const [name, value] of Object.entries(data.configuration))
                    config[name] = value;
                type.saveConfig(config);
            } catch (err) {
                console.error(err);
                socket.emit("setTypeConfig", {error: err.code});
                return;
            }
        }
        socket.emit("setTypeConfig", data);
        socket.broadcast.emit("setTypeConfig", data);
    }
};
