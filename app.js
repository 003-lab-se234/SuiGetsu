const express = require('express');
const config = require('./src/config/config');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//TODO: app.use router
app.get('/' , (req,res) => {
    res.status(200);
    res.json(config)
})

app.listen( config.port , () => {
    console.log("Server is running on port",  config.port)
})