const express = require('express');
const config = require('./src/config/config');
const path = require('path');
const router = require('./src/routes/router');
const logger = require('./src/utilities/logger');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, "public")));
app.use('/', router);

app.get('/status' , (req,res) => {
    res.status(200);
    res.json(config)
})

app.listen( config.port , () => {
    console.log(`Server is running on port ${config.port}`)
})