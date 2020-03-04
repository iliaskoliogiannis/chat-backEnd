const userMessage  = (req, res, chat) => {

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

}

module.exports = {
    userMessage
}
