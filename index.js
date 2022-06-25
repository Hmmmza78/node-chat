require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const sendMail = require("./email");


mongoose.connect("mongodb+srv://hmmmzaDev:Qa3GtdDWgSK8oeth@testdb.i7mb2.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
});
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(cookieParser());

// importing messages+chat router
msgRouter = require("./routes/messages");
chatRouter = require("./routes/chats");
userRouter = require("./routes/user");
app.use("/message", msgRouter);
app.use("/chat", chatRouter);
app.use("/", userRouter);


app.get("/profile", authenticateToken, (req, res) => {
    res.render("profile");
});


app.get("/chat-room", authenticateToken, async (req, res) => {
    // console.log(jwt.decode(req.cookies.token));
    let uid = jwt.decode(req.cookies.token);
    let userInfo = await User.findById(uid);
    res.render("chat_app", {
        token: req.cookies.token,
        uid: uid,
        userInfo
    });
});


// section for middlewares

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
        res.redirect("/login");
    }
    next();
}


app.listen(5000, () => {
    console.log("connected!");
});
