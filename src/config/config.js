const dotenv = require('dotenv');
dotenv.config()

class Config {
    port;
    env;
    constructor() {
        this.port = parseInt(process.env.PORT, 10) || 8080;
        this.env = process.env.ENV || 'dev';
    }

}

module.exports = new Config();