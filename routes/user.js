const express = require('express')
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        newFileName = new Date().toISOString().replace(/:/g, '-') + file.originalname;
        cb(null, newFileName);
    },
    fileFilter: function (req, file, cb) {

    }
});

const upload = multer({
    storage: storage
});

const User = require("../models/user");
const { append } = require('express/lib/response');

// redirecting to login page for / request
router.get("/", (req, res) => {
    res.redirect("/login");
})


router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/register", async (req, res, next) => {
    // console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
    password = await bcrypt.hash(password, 15)

    User.find({
        name: name
    }, async (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                res.send("User already exists!");
            } else {
                try {
                    const response = await User.create({
                        name,
                        password
                    });
                    res.redirect("/login")
                } catch (error) {
                    res.json(error.message);
                }
            }
        }
    });
});


router.post("/login", async (req, res) => {
    let {
        name,
        password
    } = req.body;
    User.findOne({
        name: name
    }, async (err, result) => {
        if (err) throw err;
        // console.log(result);
        if (result != null) {
            if (await bcrypt.compare(password, result.password)) {
                const token = jwt.sign(result.id, process.env.ACCESS_TOKEN_SECRET);
                res.cookie("token", token, {
                    httpOnly: true
                }).redirect("/chat-room");
            } else {
                res.send("wrong password!");
            }
        } else {
            res.send("User does not exist!")
        }
    })
});

router.post("/user/check", async (req, res) => {
    let username = req.body.username;
    let nameOld = await User.find({
        name: username
    });
    if (nameOld.length > 0) {
        res.json({
            status: "username already exists!"
        });
    } else {
        res.json({
            status: "success"
        });
    }
});

router.post("/user/update", upload.single("image"), async (req, res) => {
    let uid = req.body.uid;
    // let name = req.body.username;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    try {
        let response;
        let changePass = false;
        if (password.length > 0) {
            changePass = true;
        }
            password = await bcrypt.hash(password, 15);
        if (changePass) {
            response = await User.findByIdAndUpdate(uid, {
                // name,
                password,
                image: newFileName
            });
        } else {
            response = await User.findByIdAndUpdate(uid, {
                // name,
                image: newFileName
            });
        }
        if (response) {
            // res.json({
            //     status: "success"
            // });
            res.redirect("/chat-room");
        }
    } catch (e) {
        res.json({
            status: "internal server error!"
        });
        console.log(e);
    }
});


router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true
    }).redirect("/login");
});

// section for middlewares

// let changePass = false;
// let newFileName;

// function matchPasswords(req, res, next) {
//     console.log(req.body);
//     const password = req.body.password;
//     const cPassword = req.body.cPassword;
//     if (password.length > 0) {
//         if (password == cPassword) {
//             changePass = true;
//             next();
//         } else {
//             res.json({
//                 status: "Password and confirm password don't match!"
//             });
//         }
//     } else {
//         next();
//     }
// }

module.exports = router;