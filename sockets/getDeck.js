module.exports = socket => {
    return () => {
        socket.emit("getDeck", require("../db.json").deck);
    }
};
