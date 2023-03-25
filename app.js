const express = require('express');
const { connect, mongoStoreConnection, sessionOption } = require("./src/config/db");
const config = require('./src/config/config');
const path = require('path');
const router = require('./src/routes/router');
const logger = require('./src/utilities/logger');
const { Item } = require('./src/models/Item');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
connect();
app.use(session({
    ...sessionOption,
    store: MongoStore.create(mongoStoreConnection),
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, "public")));
app.use('/', router);

app.get('/database', async (req, res) => {
    const item1 = new Item({
        name: "Welcome to your todolist!"
    })
    const item2 = new Item({
        name: "Hit the + button to add a new item"
    })
    const item3 = new Item({
        name: "<---Hit this to delete an item"
    })
    const defaultItems = [item1, item2, item3];

    const items = await Item.find({});

    if (items.length <= 0) {
        Item.insertMany(defaultItems);
    }

    res.json(items);
})

app.get('/status', (req, res) => {
    res.status(200);
    res.json(config.printOut())
})

app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`)
})