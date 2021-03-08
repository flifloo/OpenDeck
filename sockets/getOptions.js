const getSlot = require("../types").getSlot;


module.exports = socket => {
    return data => {
        if (data) {
            let s = getSlot(name, ...slot);
            if (s)
                socket.emit("getOptions", {name: name, data: s.toJSON()});
            else
                socket.emit("getOptions", {name: name, data: null});
        } else
            socket.emit("getOptions", {error: "invalidData"});
    }
};
