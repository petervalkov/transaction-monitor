const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log('connected to db');
});

const app = express();

app.use(express.json());

app.use('/config', routes);

app.listen(process.env.PORT, () => {
    console.log('listening on ' + process.env.PORT);
});

process.on('uncaughtException', (err) => {
    console.log('uncaught\n' + err.message);
});