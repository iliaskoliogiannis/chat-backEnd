const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require("cors");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
require('dotenv').config()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

server.listen(3000);

// import users/messages/sessionId
require("./config");
const UserAuth = require("./middlewares/userAuth");

const mapAndEmit = (chat) => {
    /*----- ????? -----*/
    // const mappedChat = chat.map(c => {
    //     delete c.display;
    //     return c;
    // });
    const mappedChat = chat.filter(a => a.display == true)
        .map(c => ({
            _id: c._id,
            userType: c.userType,
            username: c.username,
            message: c.message,
            timestamp: c.timestamp
        }));

    io.emit("fullChat", mappedChat);
    io.emit("adminFullChat", chat);

};

io.on("connection", () => {
    mapAndEmit(chat);
});

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "homepage"
    })
});

app.post("/user-register", (req, res) => {

    const _id = shortid.generate();
    const token = jwt.sign({
        _id,
        username: req.body.username
    },
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN});

    users.push({
        _id,
        token,
        username: req.body.username,
        blocked: false
    });

    res.json({
        success: true,
        token
    });

});

app.post("/user-message", UserAuth, (req, res) => {

    chat.unshift({
        _id: shortid.generate(),
        userType: "user",
        username: req.body.name,
        message: req.body.message,
        timestamp: new Date(),
        display: true
    });
    mapAndEmit(chat);

    res.send({
        success: true,
        message: "message posted"
    })

});

app.post("/admin-message", (req, res) => {

    chat.unshift({
        _id: shortid.generate(),
        userType: "admin",
        username: "admin",
        message: req.body.message,
        timestamp: new Date(),
        display: true
    });
    mapAndEmit(chat);

    res.send({
        success: true,
        message: "admin message posted"
    })

});

app.post("/admin-delete-post", (req, res) => {

    const _id = req.body._id;
    const index = chat.findIndex(c => c._id == _id);
    chat[index].display = !chat[index].display;
    const mappedChat = chat.filter(a => a.display == true)
        .map(c => ({
            _id: c._id,
            userType: c.userType,
            username: c.username,
            message: c.message,
            timestamp: c.timestamp
        }));

    io.emit("fullChat", mappedChat);
    io.emit("adminFullChat", chat);

    res.send({
        success: true,
        message: "message deleted"
    })
});
