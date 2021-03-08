const socket = io();

socket.on("connected", socket => {
    console.log("Connected !");
});
