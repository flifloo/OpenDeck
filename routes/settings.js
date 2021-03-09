const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("settings/decks", { title: "Decks", path: "/settings"});
}).get("/config", (req, res) => {
    res.render("settings/config", {title:"Configuration", path: "/settings/config"})
});

module.exports = router;
