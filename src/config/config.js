const dotenv = require('dotenv');
const version = require('../../package.json').version ;
dotenv.config()

class Config {
    port;
    env;
    database;
    dbHost;
    sessionSecret ;
    version;
    constructor() {
        this.version = version ;
        this.port = parseInt(process.env.PORT, 10) || 8080;
        this.env = process.env.ENV || 'dev';
        this.sessionSecret = process.env.SESSION_SECRET || 'sawanohiroyuki'
        const host = process.env.MONGO_HOST || '127.0.0.1';
        const dbPort = process.env.MONGO_PORT || '27017';

        this.dbHost = `${host}:${dbPort}`
        this.database = {
            auth: {
                username: process.env.MONGO_USER || "user",
                password: process.env.MONGO_PASSWORD || "1234"
            },
            dbName: `suigetsu-${this.env}`
        };
    }

    getConfig = () => {
        return {
            version: this.version,
            port: this.port ,
            env: this.env,
            database: this.dbHost
        }
    }

}

module.exports = new Config();