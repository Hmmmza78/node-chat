const express = require('express')
const router = express.Router();

const Chat = require("../models/chats");
const User = require("../models/user");


router.post("/new", async (req, res) => {
    let chat = new Chat({
        person1: req.body.person1,
        person2: req.body.person2,
    });
    try {
        chat = await chat.save();
        res.send("success");
    } catch (e) {
        res.json(e);
        console.log(e);
    }
});

router.post("/newChats", async (req, res) => {
    let uid = req.body.uid;
    let oldChatsArr = [req.body.uid]; //adding the requesting user to the array so that it gets skipped while looking for vacant users

    const chats = await Chat.find({
        $or: [{
            person1: uid
        }, {
            person2: uid
        }]
    });
    for (let i = 0; i < chats.length; i++) {
        const chat = chats[i];

        if (chat.person1 != req.body.uid) {
            oldChatsArr.push(chat.person1);
        } else {
            oldChatsArr.push(chat.person2);
        }
    }
    let users = await User.find({
        "_id": {
            $nin: oldChatsArr
        }
    });
    // res.send(users);
    res.render("ajax/newChats", {
        users
    });
    /*
    in this block, user wants to look for the people that he has no chat with...
    to filter among the people, first we need to get all the users, then check if both the user and the people-person have a mutual chat...
    if they don't have any chat yet, we'll jus list that people-person in the response
    */
});


// following block must be at the end
router.post("/:id", async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{
                person1: req.params
                    .id
            }, {
                person2: req.params
                    .id
            }]
        });
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            let name;
            let other;
            let image = "default.png";

            if (chat.person1 != req.params.id) {
                other = await User.findById(chat.person1);
                name = other.name;
                image = other.image;
            } else {
                other = await User.findById(chat.person2);
                name = other.name;
                image = other.image;
            }
            chat.name = name;
            image ? chat.image = image : chat.image = "default.png";
        }
        res.render("ajax/chats", {
            chats
        });
    } catch (e) {
        res.json(e.message);
    }
});

module.exports = router;