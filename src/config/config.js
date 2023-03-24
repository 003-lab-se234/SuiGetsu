const dotenv = require('dotenv');
const version = require('../../package.json').version ;
dotenv.config()

class Config {
    port;
    env;
    version;
    constructor() {
        this.port = parseInt(process.env.PORT, 10) || 8080;
        this.env = process.env.ENV || 'dev';
        this.version = version ;
    }

}

module.exports = new Config();