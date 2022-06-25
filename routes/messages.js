const express = require('express')
const router = express.Router();

const Message = require("../models/messages");
const User = require("../models/user");


router.post("/new", async (req, res) => {
    let message = new Message({
        message: req.body.message,
        sender: req.body.sender,
        chat_id: req.body.chat_id,
    });
    try {
        message = await message.save();
        res.json({status: "success"});
    } catch (e) {
        res.json(e);
        console.log(e);
    }
});

router.post("/:id", async (req, res) => {
    let user = req.body.user;
    try {
        const messages = await Message.find({
            chat_id: req.params.id
        });let user2;

        res.render("ajax/messages", {
            messages,
            user
        });
        // res.json(messages);
    } catch (e) {
        res.json(e.message);
    }
});

module.exports = router;