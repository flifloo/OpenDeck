module.exports = socket => {
    socket.on("getDeck", require("./getDeck")(socket));
    socket.on("getDecks", require("./getDecks")(socket));
    socket.on("getSlot", require("./getSlot")(socket));
    socket.on("getType", require("./getType")(socket));
    socket.on("setSlot", require("./setSlot")(socket));
    socket.on("addDeck", require("./addDeck")(socket));
    socket.on("deleteDeck", require("./deleteDeck")(socket));
    socket.on("setTypeConfig", require("./setTypeConfig")(socket));
    socket.on("trigger", require("./trigger")(socket));
    socket.on("uploadImage", require("./uploadImage")(socket));
    console.log("New connection !");
    socket.emit("connected");
};
