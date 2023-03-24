const mongoose = require('mongoose');
const config = require('./config')
const logger = require('../utilities/logger');


exports.connect = () => {
    mongoose.connect(`mongodb://${config.dbHost}/`, config.database 
    ).then( () => logger.info("Database is connected"))
    .catch( e => logger.error(e)) 
}

