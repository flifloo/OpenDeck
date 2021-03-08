const fs = require("fs")

module.exports = (src, path) => {
    return (req, res, next) => {
        if (req.url === src) {
            res.type(".js")
            res.send(fs.readFileSync("./node_modules/"+path+".js", "utf8"))
        } else
            next();
    }
}
