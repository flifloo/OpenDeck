module.exports = socket => {
    console.log("New connection !");
    socket.emit("connected");
};
