module.exports = socket => {
    socket.on("getDeck", require("./getDeck")(socket));
    socket.on("getSlot", require("./getSlot")(socket));
    socket.on("getType", require("./getType")(socket));
    socket.on("setSlot", require("./setSlot")(socket));
    socket.on("trigger", require("./trigger")(socket));
    console.log("New connection !");
    socket.emit("connected");
};
