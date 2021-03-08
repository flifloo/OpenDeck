const { getSlot, types } = require("../types");


module.exports = socket => {
    return data => {
        let s = getSlot(data.name, ...data.position);
        try {
            if (!s)
                s = new types[data.data.type](data.data.text, data.data.image, data.data.options);
            else {
                s.text = data.data.text;
                s.image = data.data.image;
                s.options = data.data.options
            }
            s.save(data.name, data.position);
            socket.emit("setSlot", data);
            socket.broadcast.emit("setSlot", data);
        } catch (err) {
            console.error(err);
            socket.emit("setSlot", {error: err.code});
        }
    }
};
