const { User } = require("../models/User");
const logger = require("../utilities/logger");


module.exports.authentication = async (req, res, next) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.send(401)
        // return res.redirect('/signin?q=session-expired');
    }
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.send(401)
            // return res.redirect('/signin?q=session-expired');
        }
        next();
    } catch (err) {
        logger.error(err)
        res.send(500)
    }
};


module.exports.secureRoute = async (req, res, next) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.send(401)
        // return res.redirect('/signin?q=session-expired');
    }
    try {
        let user = await User.findById(userId);
        if (!user || user.role != 'staff') {
            return res.send(403)
            // return res.redirect('/');
        }
        next();
    } catch (err) {
        logger.error(err)
        res.send(500)
    }
};