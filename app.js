const express = require('express');
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

//TODO: app.use router
app.get('/' , (req,res) => {
    res.send(200);
})

app.listen( 8080 , () => {
    logger.info("Server is running on port 8080")
})