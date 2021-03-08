const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("settings/decks", { title: "Settings"});
});

module.exports = router;
