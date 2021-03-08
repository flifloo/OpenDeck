const types = require("../types").types;


module.exports = socket => {
    return () => {
        socket.emit("getType", Object.values(types).map(t => t.staticToJSON()));
    }
};
