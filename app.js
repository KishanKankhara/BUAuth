const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/YourDataBaseNameHere",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connect to DB!")
    })
    .catch((error) => {
        console.error(error + "Connection Failed!")
    });
const app = express();


//MIDDLEWARES
app.use(morgan('dev'))
app.use(bodyParser.json());

//CORS Headers
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Accept');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

//ROUTES
app.use('/users', require('./server/routes/users'));




//START SERVER
const port = process.env.port || 3000;
app.listen(port);
console.log('SERVER RUNNING: ', port);
