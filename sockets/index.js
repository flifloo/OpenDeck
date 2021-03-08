module.exports = socket => {
    socket.on("getDeck", require("./getDeck")(socket));
    socket.on("trigger", require("./trigger")(socket));
    console.log("New connection !");
    socket.emit("connected");
};
