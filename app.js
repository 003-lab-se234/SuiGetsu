const express = require('express');
const logger = require('./src/utilities/logger');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//TODO: app.use router
app.get('/' , (req,res) => {
    res.send(200);
})

app.listen( 8080 , () => {
    logger.info("Server is running on port 8080")
})