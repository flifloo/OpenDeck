const fs = require("fs");
const crypto = require('crypto');
const basePath = "./public/images/upload/";


function hash(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

module.exports = socket => {
    return data => {
        let uuid = hash(data);
        if (!(uuid in fs.readdirSync(basePath)))
            fs.writeFileSync(basePath+uuid, data);
        socket.emit("uploadImage", (basePath+uuid).replace("./public", ""))
    }
};
