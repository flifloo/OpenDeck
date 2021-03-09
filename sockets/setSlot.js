const { getSlot, types } = require("../types");


module.exports = socket => {
    return data => {
        if (data.name && data.position) {
            let s = getSlot(data.name, ...data.position);
            if (data.data) {
                try {
                    if (!s)
                        s = new types[data.data.type](data.data.text, data.data.image, data.data.options);
                    else {
                        s.text = data.data.text;
                        s.image = data.data.image;
                        s.options = data.data.options
                    }
                    s.save(data.name, data.position);
                } catch (err) {
                    console.error(err);
                    socket.emit("setSlot", {error: err.code});
                    return;
                }
            } else if (s)
                s.remove(data.name, data.position);
            else {
                socket.emit("setSlot", {error: "emptySlot"});
                return;
            }
            socket.emit("setSlot", data);
            socket.broadcast.emit("setSlot", data);
        } else
            socket.emit("setSlot", {error: "invalidData"});

    }
};
