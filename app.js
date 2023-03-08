const express = require('express');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//TODO: app.use router
app.get('/' , (req,res) => {
    res.send(200);
})

app.listen( 8080 , () => {
    console.log("Server is running on port 8080")
})