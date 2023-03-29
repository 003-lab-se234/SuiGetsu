const mongoose = require('mongoose');
const config = require('./config')
const logger = require('../utilities/logger');
const MongoStore = require("connect-mongo");


exports.connect = () => {
    mongoose.connect(`mongodb://${config.dbHost}/`, config.database
    ).then(() => logger.info("Database is connected"))
        .catch(e => logger.error(e))
}


exports.mongoStoreConnection = {
    mongoUrl: `mongodb://${config.database.auth.username}:${config.database.auth.password}@${config.dbHost}/`,
    dbName: config.database.dbName
}

exports.sessionOption = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }

}

