const jwt = require("jsonwebtoken");

const userRegisterDuplicate = (req, res, next) => {

    const userExists = users.find(u => {
        u.username = req.body.username
    });
    if(userExists) {

        // checkaroume to token
        //const token = req.headers.authorization.replace("Bearer ", "");
        // let decodedUser;
        // try {
        //     decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        // } catch (err) {
        //     return res.json({
        //         success: false,
        //         error: err.name, // defines what error occurred - expired, invalid etc
        //         message: "JWT error"
        //     });
        // }

        return res.json({
            success: false,
            message: "this nickname is already in use"
        });
    }

    next();

};

const userAuth = (req, res, next) => {

    // if (req.body.sessionId === '') {
    //     return res.json({
    //         success: false,
    //         message: "register required"
    //     })
    // }
    //
    // if(sessionId !== req.body.sessionId) {
    //     return res.json({
    //         success: false,
    //         message: "error in crosscheck of user"
    //     })
    // }

    next();

};

module.exports = userAuth;
